using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer
{
    public static class _DAL
    {
        private static string conStr = null;
        private static bool local = false;
        private static SqlConnection Con = null;
        private static SqlDataAdapter _adtr = null;
        private static SqlCommand _command = null;

        static _DAL()
        {
            Configuration config = null;
            string codeBase = Assembly.GetExecutingAssembly().CodeBase;
            UriBuilder uri = new UriBuilder(codeBase);
            string path = Uri.UnescapeDataString(uri.Path);

            string exeConfigPath = path;
            try
            {
                config = ConfigurationManager.OpenExeConfiguration(exeConfigPath);
            }
            catch (Exception e)
            {
                //handle errror here.. means DLL has no sattelite configuration file.
                throw new Exception(e.Message);
            }

            if (config != null)
            {
                conStr = GetAppSetting(config, local ? "Local" : "LiveDNS");
            }

            Con = new SqlConnection(conStr);
        }

        static string GetAppSetting(Configuration config, string key)
        {
            KeyValueConfigurationElement element = config.AppSettings.Settings[key];
            if (element != null)
            {
                string value = element.Value;
                if (!string.IsNullOrEmpty(value))
                    return value;
            }
            return string.Empty;
        }

        public static DataTable GetUsers()
        {
            try
            {
                Con.Open();
                _command = new SqlCommand("GetUsers", Con);
                _command.CommandType = CommandType.StoredProcedure;

                _adtr = new SqlDataAdapter(_command);
                DataSet ds = new DataSet();
                _adtr.Fill(ds, "Users");

                if (ds.Tables["Users"].Rows.Count != 0)
                    return ds.Tables["Users"];
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
            finally
            {
                if (Con.State == ConnectionState.Open)
                    Con.Close();
            }
            return null;
        }


        public static DataTable Register(string email, string password, string dueDate, string lastMenstrualPeriod)
        {
            string RegistrationDate = DateTime.Now.ToString($"ddd, dd MMM yyy {DateTime.UtcNow.ToString("HH:mm:ss")}") + " GMT+0";
            try
            {
                Con.Open();
                _command = new SqlCommand("Register", Con);
                _command.CommandType = CommandType.StoredProcedure;

                _command.Parameters.Add(new SqlParameter("Email", email));
                _command.Parameters.Add(new SqlParameter("Password", password));
                _command.Parameters.Add(new SqlParameter("RegistrationDate", RegistrationDate));
                _command.Parameters.Add(new SqlParameter("DueDate", dueDate));
                _command.Parameters.Add(new SqlParameter("LastMenstrualPeriod", lastMenstrualPeriod));


                DataSet ds = new DataSet();
                _adtr = new SqlDataAdapter(_command);

                _adtr.Fill(ds, "UserRegister");
                if (ds.Tables["UserRegister"].Rows.Count != 0)
                    return ds.Tables["UserRegister"];
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                if (Con.State == ConnectionState.Open)
                    Con.Close();
            }
            return null;
        }

        public static DataTable Login(string email, string password)
        {
            try
            {
                Con.Open();
                _command = new SqlCommand("Login", Con);
                _command.CommandType = CommandType.StoredProcedure;

                _command.Parameters.Add(new SqlParameter("Email", email));
                _command.Parameters.Add(new SqlParameter("Password", password));


                DataSet ds = new DataSet();
                _adtr = new SqlDataAdapter(_command);

                _adtr.Fill(ds, "UserLogin");
                if (ds.Tables["UserLogin"].Rows.Count != 0)
                    return ds.Tables["UserLogin"];
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                if (Con.State == ConnectionState.Open)
                    Con.Close();
            }
            return null;
        }

        public static DataTable SendResetPasswordEmail(string email)
        {
            try
            {
                Con.Open();
                _command = new SqlCommand("ResetPasswordRequest", Con);
                _command.CommandType = CommandType.StoredProcedure;

                _command.Parameters.Add(new SqlParameter("Email", email));

                DataSet ds = new DataSet();
                _adtr = new SqlDataAdapter(_command);

                _adtr.Fill(ds, "ResetPasswordRequest");
                if (ds.Tables["ResetPasswordRequest"].Rows.Count != 0)
                    return ds.Tables["ResetPasswordRequest"];
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                if (Con.State == ConnectionState.Open)
                    Con.Close();
            }
            return null;
        }

        public static DataTable ResetPassword(string uid, string newPassword)
        {
            try
            {
                Con.Open();
                _command = new SqlCommand("ResetPassword", Con);
                _command.CommandType = CommandType.StoredProcedure;

                _command.Parameters.Add(new SqlParameter("uid", uid));
                _command.Parameters.Add(new SqlParameter("NewPassword", newPassword));

                DataSet ds = new DataSet();
                _adtr = new SqlDataAdapter(_command);

                _adtr.Fill(ds, "ResetPassword");
                if (ds.Tables["ResetPassword"].Rows.Count != 0)
                    return ds.Tables["ResetPassword"];
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                if (Con.State == ConnectionState.Open)
                    Con.Close();
            }
            return null;
        }

        public static DataTable GetPregnancies()
        {
            try
            {
                Con.Open();
                _command = new SqlCommand("GetPregnancies", Con);
                _command.CommandType = CommandType.StoredProcedure;

                _adtr = new SqlDataAdapter(_command);
                DataSet ds = new DataSet();
                _adtr.Fill(ds, "Pregnancy");

                if (ds.Tables["Pregnancy"].Rows.Count != 0)
                    return ds.Tables["Pregnancy"];
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
            finally
            {
                if (Con.State == ConnectionState.Open)
                    Con.Close();
            }
            return null;
        }

        public static DataTable GetPregnanciesAlbums()
        {
            try
            {
                Con.Open();
                _command = new SqlCommand("GetPregnanciesAlbums", Con);
                _command.CommandType = CommandType.StoredProcedure;

                DataSet ds = new DataSet();
                _adtr = new SqlDataAdapter(_command);

                _adtr.Fill(ds, "PregnanciesAlbums");
                if (ds.Tables["PregnanciesAlbums"].Rows.Count != 0)
                    return ds.Tables["PregnanciesAlbums"];
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                if (Con.State == ConnectionState.Open)
                    Con.Close();
            }
            return null;
        }

        //public static DataTable GetPregnancyAlbumByPregnantId(int id)
        //{
        //    try
        //    {
        //        Con.Open();
        //        _command = new SqlCommand("GetPregnancyAlbum", Con);
        //        _command.CommandType = CommandType.StoredProcedure;

        //        DataSet ds = new DataSet();
        //        _adtr = new SqlDataAdapter(_command);

        //        _adtr.Fill(ds, "PregnantAlbum");
        //        if (ds.Tables["PregnantAlbum"].Rows.Count != 0)
        //            return ds.Tables["PregnantAlbum"];
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new Exception(ex.Message);
        //    }
        //    finally
        //    {
        //        if (Con.State == ConnectionState.Open)
        //            Con.Close();
        //    }
        //    return null;
        //}

        public static DataTable InsertPictureToPregnantAlbum(int pregnantId, int weekId, string pictureUri)
        {
            try
            {
                Con.Open();
                _command = new SqlCommand("InsertPictureToPregnantAlbum", Con);
                _command.CommandType = CommandType.StoredProcedure;

                _command.Parameters.Add(new SqlParameter("PregnantID", pregnantId));
                _command.Parameters.Add(new SqlParameter("WeekID", weekId));
                _command.Parameters.Add(new SqlParameter("PictureUri", pictureUri));

                DataSet ds = new DataSet();
                _adtr = new SqlDataAdapter(_command);

                _adtr.Fill(ds, "PregnantAlbum");
                if (ds.Tables["PregnantAlbum"].Rows.Count != 0)
                    return ds.Tables["PregnantAlbum"];
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                if (Con.State == ConnectionState.Open)
                    Con.Close();
            }
            return null;

        }

        public static DataTable UpdatePictureInPregnancyAlbum(int pregnantId, int weekId, string pictureUri)
        {
            try
            {
                Con.Open();
                _command = new SqlCommand("UpdatePictureInPregnancyAlbum", Con);
                _command.CommandType = CommandType.StoredProcedure;

                _command.Parameters.Add(new SqlParameter("PregnantID", pregnantId));
                _command.Parameters.Add(new SqlParameter("WeekID", weekId));
                _command.Parameters.Add(new SqlParameter("PictureUri", pictureUri));

                DataSet ds = new DataSet();
                _adtr = new SqlDataAdapter(_command);

                _adtr.Fill(ds, "PregnantAlbum");
                if (ds.Tables["PregnantAlbum"].Rows.Count != 0)
                    return ds.Tables["PregnantAlbum"];
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                if (Con.State == ConnectionState.Open)
                    Con.Close();
            }
            return null;
        
        }

        public static DataTable DeletPictureFromPregnancyAlbum(int pregnantId, int weekId)
        {
            try
            {
                Con.Open();
                _command = new SqlCommand("DeletPictureFromPregnancyAlbum", Con);
                _command.CommandType = CommandType.StoredProcedure;

                _command.Parameters.Add(new SqlParameter("PregnantID", pregnantId));
                _command.Parameters.Add(new SqlParameter("WeekID", weekId));


                DataSet ds = new DataSet();
                _adtr = new SqlDataAdapter(_command);

                _adtr.Fill(ds, "PregnantAlbum");
                if (ds.Tables["PregnantAlbum"].Rows.Count != 0)
                    return ds.Tables["PregnantAlbum"];

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                if (Con.State == ConnectionState.Open)
                    Con.Close();
            }
            return null;

        }

        public static DataTable GetContractions()
        {
            try
            {
                Con.Open();

                _command = new SqlCommand("GetContractions", Con);
                _command.CommandType = CommandType.StoredProcedure;

                _adtr = new SqlDataAdapter(_command);
                DataSet ds = new DataSet();
                _adtr.Fill(ds, "Contraction");

                if (ds.Tables["Contraction"].Rows.Count != 0)
                    return ds.Tables["Contraction"];

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                if (Con.State == ConnectionState.Open)
                    Con.Close();
            }
            return null;
        }

        public static DataTable InsertContraction(int userId,string startTime,string endTime,string length,string timeApart, string dateTime)
        {
            try
            {
                Con.Open();

                _command = new SqlCommand("InsertContraction", Con);
                _command.CommandType = CommandType.StoredProcedure;

                _command.Parameters.Add(new SqlParameter("UserID", userId));
                _command.Parameters.Add(new SqlParameter("StartTime", startTime));
                _command.Parameters.Add(new SqlParameter("EndTime", endTime));
                _command.Parameters.Add(new SqlParameter("Length", length));
                _command.Parameters.Add(new SqlParameter("TimeApart", timeApart));
                _command.Parameters.Add(new SqlParameter("DateTime", dateTime));

                _adtr = new SqlDataAdapter(_command);
                DataSet ds = new DataSet();
                _adtr.Fill(ds, "Contraction");

                if (ds.Tables["Contraction"].Rows.Count != 0)
                    return ds.Tables["Contraction"];
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                if (Con.State == ConnectionState.Open)
                    Con.Close();
            }
            return null;
        }

        public static DataTable DeleteContractionByUserId(int userId)
        {
            try
            {
                Con.Open();
                _command = new SqlCommand("DeleteContractionsById", Con);
                _command.CommandType = CommandType.StoredProcedure;

                _command.Parameters.Add(new SqlParameter("UserId", userId));

                _adtr = new SqlDataAdapter(_command);
                DataSet ds = new DataSet();
                _adtr.Fill(ds, "Contraction");

                if (ds.Tables["Contraction"].Rows.Count != 0)
                    return ds.Tables["Contraction"];
            
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                if (Con.State == ConnectionState.Open)
                    Con.Close();
            }
            return null;
        }
    }
}
