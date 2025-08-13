const router = require("express").Router();
const owners = require("../models/owner");
const regCertificate = require("../models/certificate");
const nonRegCertificate = require("../models/onSpotNewCustomer");
const customerTokens = require("../models/customerTokens");
const machines = require("../models/machine");
const { DateTime } = require('luxon');

router.get("/v1/certificate", async (req, res) => {
  try {
    console.log("Fetching certificate for customer:", req.query.token);
    const findUser = await customerTokens.findOne({ token: req.query.token });
    if (!findUser) {
      console.log("No user found with the provided token.");
      return res.status(404).json({
        error: "Unauthorized",
        status: 401,
        message: "No user found with the provided token",
      });
    }
    console.log("User found:", findUser.customerID);
    const owner = await owners.findOne({ ownerID: findUser.customerID });
    if (!owner) {
      console.log("No owner found with the provided token. Please contact support.");
        const updatingFindUser = await customerTokens.findOneAndUpdate(
      { token: req.query.token },
      {
        $set: {
          lastUsedAt: Date.now(),
          totalHits: findUser.totalHits + 1,
        },
        $push: {
          history: {
            hitTime: Date.now(),
            response: "No owner found with the provided token. Please contact support.",
          },
        },
      },
      { new: true } 
    );
      return res.status(404).json({
        error: "Unauthorized",
        status: 404,
        message: "No owner found with the provided token. Please contact support.",
      });
    }
    if (
      req.query.startTimeStampinMS === undefined ||
      req.query.endTimeStampinMS === undefined
    ) {
      console.log("Start and end timestamps are required");
         const updatingFindUser = await customerTokens.findOneAndUpdate(
      { token: req.query.token },
      {
        $set: {
          lastUsedAt: Date.now(),
          totalHits: findUser.totalHits + 1,
        },
        $push: {
          history: {
            hitTime: Date.now(),
            response: "Start and end timestamps are required",
          },
        },
      },
      { new: true } 
    );
      return res.status(400).json({
        error: "Bad Request",
        status: 400,
        message: "Start and end timestamps are required",
      });
    }

    if (
      req.query.startTimeStampinMS.length != 13 ||
      req.query.endTimeStampinMS.length != 13
    ) {
      console.log(
        "Invalid timestamp format. Timestamps should be in milliseconds."
      );
         const updatingFindUser = await customerTokens.findOneAndUpdate(
      { token: req.query.token },
      {
        $set: {
          lastUsedAt: Date.now(),
          totalHits: findUser.totalHits + 1,
        },
        $push: {
          history: {
            hitTime: Date.now(),
            response: "Invalid timestamp format. Timestamps should be in milliseconds.",
          },
        },
      },
      { new: true } 
    );
      return res.status(400).json({
        error: "Bad Request",
        status: 400,
        message:
          "Invalid timestamp format. Timestamps should be in milliseconds.",
      });
    }
    if (
      parseInt(req.query.startTimeStampinMS) >=
      parseInt(req.query.endTimeStampinMS)
    ) {
      console.log("Start timestamp must be less than end timestamp.");
         const updatingFindUser = await customerTokens.findOneAndUpdate(
      { token: req.query.token },
      {
        $set: {
          lastUsedAt: Date.now(),
          totalHits: findUser.totalHits + 1,
        },
        $push: {
          history: {
            hitTime: Date.now(),
            response: "Start timestamp must be less than end timestamp.",
          },
        },
      },
      { new: true } 
    );
      return res.status(400).json({
        error: "Bad Request",
        status: 400,
        message: "Start timestamp must be less than end timestamp.",
      });
    }
    console.log("Owner found:", owner.machines);
    let allCertificates = [];
    if (owner.machines && owner.machines.length > 0) {
      const regCerts = await regCertificate.find({
        machineID: { $in: owner.machines },
      });
      const nonRegCerts = await nonRegCertificate.find({
        machineID: { $in: owner.machines },
      });
      allCertificates = [...regCerts, ...nonRegCerts];
    }
    if (allCertificates.length === 0) {
      console.log("No certificates found for the owner's machines");
      return res.status(404).json({
        error: "Not Found",
        status: 404,
        message: "No wash found for the owner's machines",
      });
    }
    console.log("Certificates found:", allCertificates.length);
    let certificateDetails = [];
    for (let i = 0; i < allCertificates.length; i++) {
      const cert = allCertificates[i];
      if (
        parseInt(cert.CreatedAttimeStamp) >=
          parseInt(req.query.startTimeStampinMS) &&
        parseInt(cert.CreatedAttimeStamp) <=
          parseInt(req.query.endTimeStampinMS)
      ) {
       // const timeStamp = new Date(parseInt(cert.CreatedAttimeStamp));
       // const options = { timeZone: "Europe/Berlin" };
        //ISO 8601 format
        // const isoDate = timeStamp.toISOString();
         const berlinTime = DateTime.fromMillis(parseInt(cert.CreatedAttimeStamp), { zone: 'Europe/Berlin' });
        //  console.log("Berlin Time:", berlinTime.toISO());
        //  console.log("Time Stamp:", timeStamp);
        //  console.log("ISO Date:", isoDate);
        //  const berlinDate = new Date(isoDate).toLocaleDateString("de-DE", options);
        //  console.log("Berlin Date:", berlinDate);
        // //const berlinDate = timeStamp.toLocaleDateString("de-DE", options);
        // let [day, month, year] = berlinDate.split(".");
        // if (day.length < 2) day = "0" + day;
        // if (month.length < 2) month = "0" + month;
        // const time = timeStamp.toLocaleTimeString("de-DE", options);
        let machine = await machines.findOne({ machineID: cert.machineID });
        if (!machine) {
          console.log(
            "No machine found with the provided machine ID:",
            cert.machineID
          );
          continue;
        }
        let machineCurrentAddress = machine.currentAddress || "N/A"; 
        let city = machineCurrentAddress[0].city || "N/A";
        let street = machineCurrentAddress[0].street || "N/A"; 
        let streetNumber = machineCurrentAddress[0].streetNumber || "N/A"; 
        let postcode = machineCurrentAddress[0].postcode || "N/A"; 
        let completeAddress = `${street} ${streetNumber}, ${postcode} ${city}`; 
        certificateDetails.push({
          organization: owner.organization,
          wash_ID: cert.certificateID,
          machine_ID: cert.machineID,
          machine_location: completeAddress, 
          license_plate: cert.licenseNumber,
          iso_Time: berlinTime,
          timestamp_in_ms: cert.CreatedAttimeStamp,
          wash_type: cert.washType,
          cleaning_agent_used: findUser.chemicalUsage || "N/A", 
          trailer_type: cert.trailerType || "N/A", 
          pdf_link: `https://${process.env.VUE_APP_HOST}/certificate?certificate=${cert.certificateID}` || "N/A",
        });
      }
    }

    //updating findUser
   

    //console.log("User last used time updated:", updatingFindUser.lastUsedAt);
    if (certificateDetails.length === 0) {
      console.log("No certificates found in the specified time range.");
          const updatingFindUser = await customerTokens.findOneAndUpdate(
      { token: req.query.token },
      {
        $set: {
          lastUsedAt: Date.now(),
          totalHits: findUser.totalHits + 1,
        },
        $push: {
          history: {
            hitTime: Date.now(),
            response: "No Certificates found in the specified time range.",
          },
        },
      },
      { new: true } 
    );
      return res.status(200).json({
        error: "Not Found",
        status: 200,
        message: "No certificates found in the specified time range.",
      });

    }
    else {
            const updatingFindUser = await customerTokens.findOneAndUpdate(
      { token: req.query.token },
      {
        $set: {
          lastUsedAt: Date.now(),
          totalHits: findUser.totalHits + 1,
        },
        $push: {
          history: {
            hitTime: Date.now(),
            response: "Certificates fetched successfully",
          },
        },
      },
      { new: true } 
    );
      console.log("Certificates fetched successfully:", certificateDetails.length);
      return res.status(200).json({
      status: 200,
      message: "Certificates fetched successfully",
      certificates: certificateDetails,
    });
    }
    
  } catch (error) {
    console.error("Error fetching certificate:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get('/v1/countcertificate', async (req, res) => {
  try {
    const token = 'Hops-FNWf-sA5q-6ywY';

    // Validate token presence
    if (!req.query.token) {
      return res.status(400).json({ error: "Bad Request", status: 400, message: "Token is required" });
    }

    // Validate token match
    if (req.query.token !== token) {
      return res.status(401).json({ error: "Unauthorized", status: 401, message: "Invalid token" });
    }

    // Parse and validate timestamps
    const start = Number(req.query.startTimeStampinMS);
    const end = Number(req.query.endTimeStampinMS);
    if (!start || !end || isNaN(start) || isNaN(end)) {
      return res.status(400).json({ error: "Bad Request", status: 400, message: "Invalid or missing timestamp values" });
    }
    if (start >= end) {
      return res.status(400).json({ error: "Bad Request", status: 400, message: "Start timestamp must be less than end timestamp" });
    }

    const excludedMachineIDs = ['5ADA', '3IAA', '5DAB', '6CAA', '3AAH', '5AHA'];

    // Fetch certificates excluding specific machineIDs
    const regCerts = await regCertificate.find({ machineID: { $nin: excludedMachineIDs } });
    const nonRegCerts = await nonRegCertificate.find({ machineID: { $nin: excludedMachineIDs } });

    // Combine and filter by timestamp
    const allCertificates = regCerts.concat(nonRegCerts);
    const filteredCertificates = allCertificates.filter(cert =>
      cert.CreatedAttimeStamp >= start && cert.CreatedAttimeStamp <= end
    );

    // Count by machineID
    const certificateCount = {};
    filteredCertificates.forEach(cert => {
      if (certificateCount[cert.machineID]) {
        certificateCount[cert.machineID]++;
      } else {
        certificateCount[cert.machineID] = 1;
      }
    });

    return res.status(200).send(certificateCount);

  } catch (error) {
    console.error("Error counting certificates:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      status: 500,
      message: "An error occurred while processing the request"
    });
  }
});

router.get('/v1/countcertificatetoday', async (req, res)=>{
  // try {
  //   const token = 'Hops-FNWf-sA5q-6ywY';
  //   if (!req.query.token) {
  //     return res.status(400).json({ error: "Bad Request", status: 400, message: "Token is required" });
  //   }

  //   const today = DateTime.now().setZone('Europe/Berlin').startOf('day');
  //   const startTimestamp = today.toMillis();
  //  // End of the day in Europe/Berlin timezone
  //   const endTimestamp = today.endOf('day').toMillis();
  //   console.log("Start Timestamp:", startTimestamp);
  //   console.log("End Timestamp:", endTimestamp);
   

  //   // Validate token match
  //   if (req.query.token !== token) {
  //     return res.status(401).json({ error: "Unauthorized", status: 401, message: "Invalid token" });
  //   }

  //   // Parse and validate timestamps
  //   const start = Number(startTimestamp);
  //   const end = Number(endTimestamp);
  //   console.log("Start Timestamp:", start);
  //   console.log("End Timestamp:", end);
  //   if (!start || !end || isNaN(start) || isNaN(end)) {
  //     return res.status(400).json({ error: "Bad Request", status: 400, message: "Invalid or missing timestamp values" });
  //   }
  //   if (start >= end) {
  //     return res.status(400).json({ error: "Bad Request", status: 400, message: "Start timestamp must be less than end timestamp" });
  //   }

  //   const excludedMachineIDs = ['5ADA', '3IAA', '5DAB', '6CAA', '3AAH', '5AHA'];

  //   // Fetch certificates excluding specific machineIDs
  //   const regCerts = await regCertificate.find({ machineID: { $nin: excludedMachineIDs } });
  //   const nonRegCerts = await nonRegCertificate.find({ machineID: { $nin: excludedMachineIDs } });
  //   // Combine and filter by timestamp
  //   const allCertificates = regCerts.concat(nonRegCerts);
  //   const filteredCertificates = allCertificates.filter(cert =>
  //     cert.CreatedAttimeStamp >= start && cert.CreatedAttimeStamp <= end
  //   );
  //   //filtercertificate for this month
  //   const currentMonth = DateTime.now().setZone('Europe/Berlin').month;
  //   const filteredCertificatesThisMonth = filteredCertificates.filter(cert => {
  //     const certDate = DateTime.fromMillis(cert.CreatedAttimeStamp, { zone: 'Europe/Berlin' });
  //     return certDate.month === currentMonth;
  //   });

  //   // Count by machineID but only for today and this month
  //   const certificateCount = {};
  //   filteredCertificatesThisMonth.forEach(cert => {
  //     if (certificateCount[cert.machineID]) {
  //       certificateCount[cert.machineID]++;
  //     } else {
  //       certificateCount[cert.machineID] = 1;
  //     }
  //   }); 

  //   return res.status(200).send(certificateCount);
   
  // }
  // catch (error) {
  //   console.error("Error counting today's certificates:", error);
  //   return res.status(500).json({
  //     error: "Internal Server Error",
  //     status: 500,
  //     message: "An error occurred while processing the request"
  //   });
  // }
  try {
    const token = process.env.count_token;
    if (!req.query.token) {
      return res.status(400).json({ error: "Bad Request", status: 400, message: "Token is required" });
    }

    if (req.query.token !== token) {
      return res.status(401).json({ error: "Unauthorized", status: 401, message: "Invalid token" });
    }

    const today = DateTime.now().setZone('Europe/Berlin').startOf('day');
    const startTimestamp = Number(today.toMillis());
    const endTimestamp = Number(today.endOf('day').toMillis());
    const currentMonth = DateTime.now().setZone('Europe/Berlin').month;
    const excludedMachineIDs = ['5ADA', '3IAA', '5DAB', '6CAA', '3AAH', '5AHA', '6ADA','5E7A'];

    const registeredCertificate = await regCertificate.find({ machineID: { $nin: excludedMachineIDs } });
    const nonRegisteredCertificate = await nonRegCertificate.find({ machineID: { $nin: excludedMachineIDs } });

    const allCertificates = registeredCertificate.concat(nonRegisteredCertificate);

    if (allCertificates.length === 0) {
      return res.status(404).json({ error: "Not Found", status: 404, message: "No certificates found" });
    }

    const countsByMachine = {};

    for (const cert of allCertificates) {
      const machineID = cert.machineID;
      const createdTime = Number(cert.CreatedAttimeStamp);
      const certDate = DateTime.fromMillis(createdTime, { zone: 'Europe/Berlin' });

      if (!countsByMachine[machineID]) {
        countsByMachine[machineID] = { today: 0, thisMonth: 0 };
      }

      if (createdTime >= startTimestamp && createdTime <= endTimestamp) {
        countsByMachine[machineID].today += 1;
      }

      if (certDate.month === currentMonth) {
        countsByMachine[machineID].thisMonth += 1;
      }
    }

    // Convert counts to "today/thisMonth" format
    const formattedCounts = {};
    for (const [machineID, counts] of Object.entries(countsByMachine)) {
      formattedCounts[machineID] = ` ${counts.today} / ${counts.thisMonth}`;
    }

    return res.status(200).send(formattedCounts);

  } catch (error) {
    console.error("Error counting certificates:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      status: 500,
      message: "An error occurred while processing the request"
    });
  }
})
router.get('/v1/countcertificatetodayandthismonth', async (req, res) => {
  try {
    const token = process.env.count_token;
    if (!req.query.token) {
      return res.status(400).json({ error: "Bad Request", status: 400, message: "Token is required" });
    }

    if (req.query.token !== token) {
      return res.status(401).json({ error: "Unauthorized", status: 401, message: "Invalid token" });
    }

    const today = DateTime.now().setZone('Europe/Berlin').startOf('day');
    const startTimestamp = Number(today.toMillis());
    const endTimestamp = Number(today.endOf('day').toMillis());
    const currentMonth = DateTime.now().setZone('Europe/Berlin').month;
    const excludedMachineIDs = ['5ADA', '3IAA', '5DAB', '6CAA', '3AAH', '5AHA', '6ADA'];

    const registeredCertificate = await regCertificate.find({ machineID: { $nin: excludedMachineIDs } });
    const nonRegisteredCertificate = await nonRegCertificate.find({ machineID: { $nin: excludedMachineIDs } });

    const allCertificates = registeredCertificate.concat(nonRegisteredCertificate);

    if (allCertificates.length === 0) {
      return res.status(404).json({ error: "Not Found", status: 404, message: "No certificates found" });
    }

    const countsByMachine = {};

    for (const cert of allCertificates) {
      const machineID = cert.machineID;
      const createdTime = Number(cert.CreatedAttimeStamp);
      const certDate = DateTime.fromMillis(createdTime, { zone: 'Europe/Berlin' });

      if (!countsByMachine[machineID]) {
        countsByMachine[machineID] = { today: 0, thisMonth: 0 };
      }

      if (createdTime >= startTimestamp && createdTime <= endTimestamp) {
        countsByMachine[machineID].today += 1;
      }

      if (certDate.month === currentMonth) {
        countsByMachine[machineID].thisMonth += 1;
      }
    }

    // Convert counts to "today/thisMonth" format
    const formattedCounts = {};
    for (const [machineID, counts] of Object.entries(countsByMachine)) {
      formattedCounts[machineID] = `${counts.today}/${counts.thisMonth}`;
    }

    return res.status(200).json({
      status: 200,
      message: "Counts fetched successfully",
      counts: formattedCounts
    });

  } catch (error) {
    console.error("Error counting certificates:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      status: 500,
      message: "An error occurred while processing the request"
    });
  }
});

router.get('/v1/countcertificatemachinewise', async (req, res)=>{
  try{
    const token = process.env.count_token;
    if (!req.query.token) {
      return res.status(400).json({ error: "Bad Request", status: 400, message: "Token is required" });
    }
    // Validate token match
    if (req.query.token !== token) {
      return res.status(401).json({ error: "Unauthorized", status: 401, message: "Invalid token" });
    }
    let machineID = '';
    if(req.query.retrive == 'mdCqWo'){
      machineID = '8AAA';
    }
    else if(req.query.retrive == 'c7XvkQ'){
      machineID = '9A6D';
    }

    if (!machineID) {
      return res.status(400).json({ error: "Bad Request", status: 400, message: "Machine ID is required" });
    }
    const registeredCertificate = await regCertificate.find({ machineID: machineID });
    const nonRegisteredCertificate = await nonRegCertificate.find({ machineID: machineID });
    
    let allCertiticates = registeredCertificate.concat(nonRegisteredCertificate);
    console.log("All Certificates:", allCertiticates.length);
    if (allCertiticates.length === 0) {
      return res.status(404).json({ error: "Not Found", status: 404, message: "No certificates found for the specified machine ID" });
    }

    const today = DateTime.now().setZone('Europe/Berlin').startOf('day');
    const startTimestamp = today.toMillis();
   // End of the day in Europe/Berlin timezone
    const endTimestamp = today.endOf('day').toMillis();
    console.log("Start Timestamp:", startTimestamp);
    console.log("End Timestamp:", endTimestamp);
    // Filter certificates by today's date
    const filteredCertificates = allCertiticates.filter(cert => 
      cert.CreatedAttimeStamp >= startTimestamp && cert.CreatedAttimeStamp <= endTimestamp
    );
    
    // Count certificates
    const certificateCount = filteredCertificates.length;
    console.log("Certificate Count:", certificateCount);
   //make the machineID as key and count as value
    const machineWiseCount = {};
    machineWiseCount[machineID] = certificateCount;

    return res.status(200).send(machineWiseCount)

  }
  catch(error){
    console.error("Error counting machine-wise certificates:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      status: 500,
      message: "An error occurred while processing the request"
    });
  }
})


router.get('/v1/countcertificatetodayandthismonth', async (req, res) => {
  try {
    const token = process.env.count_token;
    if (!req.query.token) {
      return res.status(400).json({ error: "Bad Request", status: 400, message: "Token is required" });
    }

    if (req.query.token !== token) {
      return res.status(401).json({ error: "Unauthorized", status: 401, message: "Invalid token" });
    }

    const today = DateTime.now().setZone('Europe/Berlin').startOf('day');
    const startTimestamp = Number(today.toMillis());
    const endTimestamp = Number(today.endOf('day').toMillis());
    const currentMonth = DateTime.now().setZone('Europe/Berlin').month;
    const excludedMachineIDs = ['5ADA', '3IAA', '5DAB', '6CAA', '3AAH', '5AHA', '6ADA','5E7A'];

    const registeredCertificate = await regCertificate.find({ machineID: { $nin: excludedMachineIDs } });
    const nonRegisteredCertificate = await nonRegCertificate.find({ machineID: { $nin: excludedMachineIDs } });

    const allCertificates = registeredCertificate.concat(nonRegisteredCertificate);

    if (allCertificates.length === 0) {
      return res.status(404).json({ error: "Not Found", status: 404, message: "No certificates found" });
    }

    const countsByMachine = {};

    for (const cert of allCertificates) {
      const machineID = cert.machineID;
      const createdTime = Number(cert.CreatedAttimeStamp);
      const certDate = DateTime.fromMillis(createdTime, { zone: 'Europe/Berlin' });

      if (!countsByMachine[machineID]) {
        countsByMachine[machineID] = { today: 0, thisMonth: 0 };
      }

      // Count for today
      if (createdTime >= startTimestamp && createdTime <= endTimestamp) {
        countsByMachine[machineID].today += 1;
      }

      // Count for this month
      if (certDate.month === currentMonth) {
        countsByMachine[machineID].thisMonth += 1;
      }
    }

    return res.status(200).json({
      status: 200,
      message: "Counts fetched successfully",
      counts: countsByMachine
    });

  } catch (error) {
    console.error("Error counting certificates:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      status: 500,
      message: "An error occurred while processing the request"
    });
  }
});


module.exports = router;
