
const appointment = require("../models/appointmentModel");
module.exports= async (req,res)=>{
    // res.send('Rendring via controllers')
    const selectedDate = req.query.date || new Date().toISOString().split("T")[0];
      const appointments = await Appointment.find({ date: selectedDate });
      const bookedSlots = appointments.map((appointment) => appointment.time) || [];
    
      console.log("Available slots:" + bookedSlots);
      res.render("appointment", {
        user: req.session.user,
        bookedSlots,
        selectedDate,
      });
 };
