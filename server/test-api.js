// End-to-end API test suite for Bharat Bhoomi Backend
import app from "./index.js";

async function runTests() {
  const PORT = 5001;
  const server = app.listen(PORT, async () => {
    console.log(`\n🧪 Running Bharat Bhoomi Backend Test Suite on port ${PORT}...`);
    const BASE_URL = `http://localhost:${PORT}/api`;
    let testsPassed = 0;
    let testsTotal = 0;

    function assert(condition, testName) {
      testsTotal++;
      if (condition) {
        console.log(`  ✓ [PASS] ${testName}`);
        testsPassed++;
      } else {
        console.error(`  ✗ [FAIL] ${testName}`);
      }
    }

    try {
      // Test 1: Healthcheck
      const healthRes = await fetch(`${BASE_URL}/health`).then((r) => r.json());
      assert(healthRes.status === "ok", "GET /api/health returns status 'ok'");

      // Test 2: Officer Login
      const officerLogin = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "officer.revenue",
          password: "Password123!",
          department: "Revenue Department",
          role: "officer",
        }),
      }).then((r) => r.json());
      assert(officerLogin.success && officerLogin.token, "POST /api/auth/login officer authentication");
      const officerToken = officerLogin.token;

      // Test 3: Citizen Login
      const citizenLogin = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "citizen.rahul",
          password: "Password123!",
          role: "citizen",
        }),
      }).then((r) => r.json());
      assert(citizenLogin.success && citizenLogin.token, "POST /api/auth/login citizen authentication");

      // Test 4: Auth Session /me
      const meRes = await fetch(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${officerToken}` },
      }).then((r) => r.json());
      assert(meRes.success && meRes.user.role === "officer", "GET /api/auth/me returns valid officer session");

      // Test 5: Global Stats
      const statsRes = await fetch(`${BASE_URL}/stats`).then((r) => r.json());
      assert(statsRes.success && statsRes.stats.totalParcels > 0, "GET /api/stats returns national metrics");

      // Test 6: State Stats
      const stateRes = await fetch(`${BASE_URL}/stats/state/Uttar%20Pradesh`).then((r) => r.json());
      assert(stateRes.success && stateRes.summary.length > 0, "GET /api/stats/state returns state breakdown");

      // Test 7: Parcels Search
      const searchRes = await fetch(`${BASE_URL}/parcels?query=123/4`).then((r) => r.json());
      assert(searchRes.success && searchRes.parcels.length > 0, "GET /api/parcels searches by Survey Number");

      // Test 8: Parcel Detail & Mutation History
      const parcelRes = await fetch(`${BASE_URL}/parcels/1`).then((r) => r.json());
      assert(parcelRes.success && parcelRes.parcel.survey_number === "123/4", "GET /api/parcels/1 returns parcel specification");

      // Test 9: Create New Parcel (Officer)
      const createRes = await fetch(`${BASE_URL}/parcels`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${officerToken}`,
        },
        body: JSON.stringify({
          survey_number: "299/1",
          state: "Uttar Pradesh",
          district: "Agra",
          tehsil: "Etmadpur",
          village: "Phalera",
          owner_name: "Surendra Pal",
          land_type: "Agricultural",
          area_acres: 3.2,
          valuation_inr: 5200000,
          tax_status: "Paid",
        }),
      }).then((r) => r.json());
      assert(createRes.success && createRes.ulpin, "POST /api/parcels registers new parcel and generates ULPIN");
      const createdId = createRes.parcelId;

      // Test 10: Ownership Mutation (Officer)
      const mutateRes = await fetch(`${BASE_URL}/parcels/${createdId}/mutate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${officerToken}`,
        },
        body: JSON.stringify({
          new_owner: "Deepak Pal",
          type: "Sale Deed",
          remarks: "Verified sale deed registered at Tehsil Etmadpur.",
        }),
      }).then((r) => r.json());
      assert(mutateRes.success && mutateRes.new_owner === "Deepak Pal", "POST /api/parcels/:id/mutate executes title transfer");

      // Test 11: Verify Record (Officer)
      const verifyRes = await fetch(`${BASE_URL}/parcels/${createdId}/verify`, {
        method: "POST",
        headers: { Authorization: `Bearer ${officerToken}` },
      }).then((r) => r.json());
      assert(verifyRes.success, "POST /api/parcels/:id/verify confirms cadastral verification");

      // Test 12: Citizen Grievance Submission
      const grievanceRes = await fetch(`${BASE_URL}/grievances`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: "Anand Verma",
          email: "anand.verma@example.com",
          phone: "+91 99887 76655",
          category: "Revenue Department",
          requestType: "Grievance",
          subject: "Verification of mutation entry in record 299/1",
          description: "Requesting prompt inspection of updated boundary markers.",
        }),
      }).then((r) => r.json());
      assert(grievanceRes.success && grievanceRes.referenceId, "POST /api/grievances creates grievance and returns Reference ID");
      const refId = grievanceRes.referenceId;

      // Test 13: Public Grievance Tracking
      const trackRes = await fetch(`${BASE_URL}/grievances/track/${refId}`).then((r) => r.json());
      assert(trackRes.success && trackRes.grievance.status === "Submitted", "GET /api/grievances/track/:refId tracks submission");

      // Test 14: Officer Update Grievance Status
      const listGrievances = await fetch(`${BASE_URL}/grievances`, {
        headers: { Authorization: `Bearer ${officerToken}` },
      }).then((r) => r.json());
      const targetG = listGrievances.grievances.find((g) => g.reference_id === refId);
      if (targetG) {
        const updateG = await fetch(`${BASE_URL}/grievances/${targetG.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${officerToken}`,
          },
          body: JSON.stringify({
            status: "Resolved",
            officer_notes: "Field inspection completed by Naib Tehsildar. Boundary verified.",
          }),
        }).then((r) => r.json());
        assert(updateG.success, "PATCH /api/grievances/:id updates status to Resolved with remarks");
      }

      // Test 15: Audit Logs
      const auditRes = await fetch(`${BASE_URL}/audit-logs`).then((r) => r.json());
      assert(auditRes.success && auditRes.logs.length >= 4, "GET /api/audit-logs records all mutations and actions");

      console.log(`\n🎉 Test Suite Completed: ${testsPassed}/${testsTotal} passed!\n`);
    } catch (err) {
      console.error("Test execution error:", err);
    } finally {
      server.close(() => {
        process.exit(testsPassed === testsTotal ? 0 : 1);
      });
    }
  });
}

runTests();
