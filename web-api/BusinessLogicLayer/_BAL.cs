using BusinessLogicLayer.Models;
using DataAccessLayer;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer
{
    public class _BAL
    {

        public static List<User> GetUsers()
        {
            List<User> users = null;
            DataTable res = _DAL.GetUsers();

            if (res == null)
                return null;

            foreach (DataRow row in res.Rows)
            {
                if (users == null)
                    users = new List<User>();

                users.Add(new User()
                {
                    ID = int.Parse(row["UserID"].ToString()),
                    FirstName = row["FirstName"].ToString(),
                    LastName = row["LastName"].ToString(),
                    Email = row["Email"].ToString(),
                    RegistrationDate = row["RegistrationDate"].ToString()
                });
            }
            return users;
        }

        public static User Register(string email, string password, string dueDate, string lastMenstrualPeriod)
        {
            User u = null;
            DataTable res = _DAL.Register(email, password, dueDate, lastMenstrualPeriod);

            if (res == null)
                return null;

                u = new User()
                {
                    ID = int.Parse(res.Rows[0]["ID"].ToString())
                };

            return u;
        }

        public static User Login(string email, string password)
        {
            User u = null;
            DataTable res = _DAL.Login(email, password);

            if (res == null)
                return null;

                u = new User()
                {
                    ID = int.Parse(res.Rows[0]["ID"].ToString()),
                };

            return u;
        }

        public static ResetPasswordRequest SendResetPasswordEmail(string email)
        {
            DataTable res = _DAL.SendResetPasswordEmail(email);


            if (res == null)
                return null;

            if (Convert.ToBoolean((int)res.Rows[0]["ReturnCode"]))
            {
                ResetPasswordRequest result = new ResetPasswordRequest()
                {
                    UniqueID = res.Rows[0]["UniqueID"].ToString(),
                    Email = email,
                };
                return result;
            }

            return null;
        }

        public static bool ResetPassword(string uid, string newPassword)
        {
            DataTable res = _DAL.ResetPassword(uid, newPassword);

            if (res == null)
                return false;

            bool result = Convert.ToBoolean((int)res.Rows[0]["ReturnCode"]);

            return result;

        }

        public static List<Pregnancy> GetPregnancies()
        {
            List<Pregnancy> p = null;
            DataTable res = _DAL.GetPregnancies();

            if (res == null)
                return null;

            foreach (DataRow row in res.Rows)
            {
                if (p == null)
                    p = new List<Pregnancy>();

                p.Add(new Pregnancy()
                {
                    PregnantID = int.Parse(row["PregnantID"].ToString()),
                    UserID = int.Parse(row["UserID"].ToString()),
                    DueDate = DateTime.Parse(row["DueDate"].ToString()).ToShortDateString(),
                    LastMenstrualPeriod = DateTime.Parse(row["LastMenstrualPeriod"].ToString()).ToShortDateString(),
                    ChildName = row["ChildName"].ToString(),
                    BirthDate = row["BirthDate"].ToString(),
                    Gender = row["Gender"].ToString(),
                    IsNewBorn = row["IsNewBorn"].ToString()
                });
            }
            return p;

        }
    }
}
