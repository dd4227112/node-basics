// nodemailer
const nodemailer = require('nodemailer');


const sendMail = async (option) => { // recieve a option objects( to, body, subject) // this a asynchronous function
    //create transport  service
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST, // host name
        port: process.env.EMAIL_PORT,
        // secure: true, //if true means SSL
        tls: true,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        }
    });

    //create a email options
    const emailOptions = {
        from: 'Ecommerce Support@<ecommerce.support@gmail.com',
        to: option.email,
        subject: option.subject,
        html: option.message // html or text
    }
    // send mail by callind transporter.sendMail
    await transporter.sendMail(emailOptions)
}
module.exports = sendMail;
