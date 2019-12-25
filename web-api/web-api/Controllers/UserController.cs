using BusinessLogicLayer;
using BusinessLogicLayer.Models;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Mail;
using System.Text;
using System.Web.Http;
using System.Web.Http.Cors;


namespace web_api.Controllers
{
    [RoutePrefix("api/User")]
    public class UserController : ApiController
    {
        // GET api/user
        public IHttpActionResult Get()
        {
            try
            {
                List<User> u = _BAL.GetUsers().ToList();
                return Ok(u);
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.BadRequest, ex);
            }
        }


        // GET api/user/1
        [Route("{id:int:min(1)}", Name = "GetUserById")]
        public IHttpActionResult Get(int id)
        {
            try
            {
                User u = _BAL.GetUsers().SingleOrDefault(x => x.ID == id);
                if (u == null)
                    return Content(HttpStatusCode.NotFound, "user with id {" + id + "} was not found");

                return Ok(u);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST api/user
        [HttpPost]
        [Route("Register")]
        public IHttpActionResult PostRegister([FromBody]JObject data)
        {
            try
            {
                User u = _BAL.Register((string)data["email"], (string)data["password"], (string)data["dueDate"], (string)data["lastMenstrualPeriod"]);

                return Created(new Uri(Url.Link("GetUserById", new { id = u.ID })), u);
            }
            catch (Exception ex)
            {
                // maybe to write into a file log
                return BadRequest("user already exist -> " + ex.Message);
            }
        }

        // POST api/users
        [HttpPost]
        [Route("Login")]
        public IHttpActionResult PostLogin([FromBody]User user)
        {
            try
            {
                User u = _BAL.Login(user.Email, user.Password);

                return Ok(u);
            }
            catch (Exception ex)
            {
                // maybe to write into a file log
                return BadRequest("Incorrect username or password -> " + ex.Message);
            }
        }

        // פונקציה לשליחת מייל איפוס סיסמה למשתמש
        [HttpPost]
        [EnableCors("*","*","*")]
        [Route("SendResetPasswordEmail")]
        public IHttpActionResult PostSendResetPasswordEmail([FromBody]User user)
        {
            try
            {
                ResetPasswordRequest result = _BAL.SendResetPasswordEmail(user.Email); // קריאה לפונקציה שתחזיר את פרטי הבקשה
                if (result == null) // במידה והמשתמש לא קיים
                    return BadRequest("Email does not exists");
                
                MailMessage mailMessage = new MailMessage("pregnancy.helper.proj@gmail.com",user.Email); // יצירת אובייקט לשליחת מייל
                
                StringBuilder sbEmailBody = new StringBuilder(); // יצירת אובייקט לבניית תוכן הודעת המייל
                sbEmailBody.Append("Dear " + user.Email.Substring(0, user.Email.IndexOf("@")) + ",<br/><br/>");
                sbEmailBody.Append("Please click on the following link to reset your password");
                sbEmailBody.Append("<br/>");
                // קישור לאתר, על מנת לבצע איפוס סיסמה של המשתמש לפי המזהה המיוחד שנשלח בסוף הקישור ונשמר בטבלת הבקשות לאיפוס ססימה
                sbEmailBody.Append("http://ruppinmobile.tempdomain.co.il/site08/build/#/resetpassword/" + result.UniqueID);
                sbEmailBody.Append("<br/><br/>");
                sbEmailBody.Append("Pregnancy Helper");

                mailMessage.IsBodyHtml = true;
                mailMessage.Body = sbEmailBody.ToString();
                mailMessage.Subject = "Reset Your Password";
				
                SmtpClient client = new SmtpClient("smtp.gmail.com", 587) // יצירת אובייקט לשליחת המייל
                {
                    Credentials = new NetworkCredential("pregnancy.helper.proj@gmail.com", "PREGNANCYhelper90"), // יצירת אובייקט עם פרטי כניסה של המייל השולח
                    EnableSsl = true
                };
                client.Send(mailMessage); // שליחת מייל
                return Ok("We've sent you email to reset your password"); // החזרת סטטוס הכל תקין
            }
            catch (Exception ex)
            {
                return BadRequest("somthing went worng" + ex.Message);
            }
        }

        [HttpPost]
        [EnableCors("*", "*", "*")]
        [Route("ResetPassword")]
        public IHttpActionResult PostResetPassword([FromBody]ResetPasswordRequest request)
        {
            bool res = _BAL.ResetPassword(request.UniqueID, request.NewPassword);

            if (res)
                return Ok(res + " - Password updated successfully");
            else
                return BadRequest(res + " - Password updated faild");
        }


    }
}
