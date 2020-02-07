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

            int id = int.Parse(res.Rows[0]["UserID"].ToString());

            if (id < 1)
            {
                u = new User()
                {
                    ID = id,
                };
            }
            else
            {
                u = new User()
                {
                    ID = int.Parse(res.Rows[0]["UserID"].ToString()),
                    Email = res.Rows[0]["Email"].ToString()
                };
            }

            return u;
        }

        public static User Login(string email, string password)
        {
            User u = null;
            DataTable res = _DAL.Login(email, password);

            if (res == null)
                return null;

            int id = int.Parse(res.Rows[0]["UserID"].ToString());

            if (id < 1)
            {
                u = new User()
                {
                    ID = id,
                };
            }
            else
            {
                u = new User()
                {
                    ID = int.Parse(res.Rows[0]["UserID"].ToString()),
                    Email = res.Rows[0]["Email"].ToString()
                };
            }

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
                    Gender = int.Parse(row["Gender"].ToString()),
                    IsNewBorn = row["IsNewBorn"].ToString()
                });
            }
            return p;

        }

        public static bool UpdatePregnancyDates(int pregnantId,string dueDate,string lastMenstrualPeriod)
        {
            DataTable res = _DAL.UpdatePregnancyDates(pregnantId, dueDate, lastMenstrualPeriod);
            bool isUpdated = false;
            if (res == null)
                return isUpdated;

            isUpdated = Convert.ToBoolean((int)res.Rows[0]["Result"]);
            return isUpdated;
        }

        public static bool UpdateChildName(int pregnantId, string childName)
        {
            DataTable res = _DAL.UpdateChildName(pregnantId, childName);
            bool isUpdated = false;
            if (res == null)
                return isUpdated;

            isUpdated = Convert.ToBoolean((int)res.Rows[0]["Result"]);
            return isUpdated;
        }

        public static bool UpdateGender(int pregnantId, int gender)
        {
            DataTable res = _DAL.UpdateGender(pregnantId, gender);
            bool isUpdated = false;
            if (res == null)
                return isUpdated;

            isUpdated = Convert.ToBoolean((int)res.Rows[0]["Result"]);
            return isUpdated;
        }

        public static List<PregnancyAlbum> GetPregnanciesAlbums()
        {
            List<PregnancyAlbum> albums = null;
            DataTable res = _DAL.GetPregnanciesAlbums();

            if (res == null)
                return null;

            foreach (DataRow row in res.Rows)
            {
                if (albums == null)
                    albums = new List<PregnancyAlbum>();

                albums.Add(new PregnancyAlbum()
                {
                    PregnantID = int.Parse(row["PregnantID"].ToString()),
                    WeekID = int.Parse(row["WeekID"].ToString()),
                    PictureUri = row["PictureUri"].ToString()
                });
            }
            return albums;
        }

        public static List<PregnancyAlbum> GetPregnancyAlbumByPregnantId(int id, List<PregnancyAlbum> albums)
        {
            List<PregnancyAlbum> pictures = null;

            if (albums == null)
                return null;

            foreach (PregnancyAlbum pic in albums)
            {
                if (pictures == null)
                    pictures = new List<PregnancyAlbum>();

                if(pic.PregnantID == id)
                {
                    pictures.Add(pic);
                }
            }

            if (pictures == null || pictures.Count == 0)
                return null;

            return pictures;

        }

        public static PregnancyAlbum InsertPictureToPregnantAlbum(int pregnantId, int weekId, string pictureUri)
        {
            PregnancyAlbum album = null;
            DataTable res = _DAL.InsertPictureToPregnantAlbum(pregnantId, weekId, pictureUri);

            if (res == null)
                return null;

            album = new PregnancyAlbum()
            {
                PregnantID = pregnantId,
                WeekID = weekId,
                PictureUri = pictureUri
            };

            return album;
        }

        public static PregnancyAlbum UpdatePictureInPregnancyAlbum(int pregnantId,int weekId,string pictureUri)
        {
            PregnancyAlbum picture = null;
            DataTable res = _DAL.UpdatePictureInPregnancyAlbum(pregnantId, weekId, pictureUri);

            if (res == null)
                return null;

            picture = new PregnancyAlbum()
            {
                PregnantID = pregnantId,
                WeekID = weekId,
                PictureUri = pictureUri
            };

            return picture;
        }

        public static bool DeletPictureFromPregnancyAlbum (int pregnantId, int weekId)
        {
            bool isDeleted = false;
            DataTable result = _DAL.DeletPictureFromPregnancyAlbum(pregnantId, weekId);

            if (result == null)
                return isDeleted;

            isDeleted = Convert.ToBoolean((int)result.Rows[0]["Result"]);
            
            return isDeleted;
                
        }

        public static List<Contraction> GetContractions()
        {
            List<Contraction> contractions = null;
            DataTable res = _DAL.GetContractions();

            if (res == null)
                return null;

            foreach (DataRow row in res.Rows)
            {
                if (contractions == null)
                    contractions = new List<Contraction>();

                contractions.Add(new Contraction()
                {
                    UserID = int.Parse(row["UserID"].ToString()),
                    ContractionID = int.Parse(row["ContractionID"].ToString()),
                    StartTime = row["StartTime"].ToString(),
                    EndTime = row["EndTime"].ToString(),
                    Length = row["ContractionLength"].ToString(),
                    TimeApart = row["TimeApart"].ToString(),
                    DateTime = row["Date"].ToString(),
                });
            }
            return contractions;
        }

        public static List<Contraction> GetContractionsByUserId(int id, List<Contraction> list)
        {
            List<Contraction> contractions = null;

            if (list == null)
                return null;

            foreach(Contraction contraction in list)
            {
                if (contractions == null)
                    contractions = new List<Contraction>();

                if(contraction.UserID == id)
                {
                    contractions.Add(contraction);
                }
            }

            if (contractions == null || contractions.Count == 0)
                return null;

            return contractions;
        }

        public static Contraction InsertContraction(int userId, string startTime, string endTime, string length, string timeApart,string dateTime)
        {
            Contraction contraction = null;
            DataTable res = _DAL.InsertContraction(userId,startTime,endTime,length,timeApart,dateTime);

            if (res == null)
                return null;

            contraction = new Contraction()
            {
                UserID = userId

            };

            return contraction;

        }

        public static bool DeleteContractionByUserId(int userId)
        {
            bool isDeleted = false;
            DataTable result = _DAL.DeleteContractionByUserId(userId);

            if (result == null)
                return isDeleted;

            isDeleted = Convert.ToBoolean((int)result.Rows[0]["Result"]);

            return isDeleted;
        }

        public static List<KickTracker> GetKickTrackers()
        {
            List<KickTracker> list = null;
            DataTable res = _DAL.GetKickTrackers();

            if (res == null)
                return null;

            foreach(DataRow row in res.Rows)
            {
                if (list == null)
                    list = new List<KickTracker>();
                list.Add(new KickTracker()
                {
                    PregnantID = int.Parse(row["PregnantID"].ToString()),
                    Date = row["Date"].ToString(),
                    Length = row["Length"].ToString(),
                    Time = row["Time"].ToString(),
                    Kicks = int.Parse(row["Kicks"].ToString())
                });
            }
            return list;
        }

        public static List<KickTracker> GetKickTrackerByPregnantId(int id, List<KickTracker> list)
        {
            List<KickTracker> kickTrackers = null;

            if (list == null)
                return null;

            foreach (KickTracker kickTracker in list)
            {
                if (kickTrackers == null)
                    kickTrackers = new List<KickTracker>();

                if (kickTracker.PregnantID == id)
                {
                    kickTrackers.Add(kickTracker);
                }
            }

            if (kickTrackers == null || kickTrackers.Count == 0)
                return null;

            return kickTrackers;
        }

        public static bool InsertKickTracker(int pregnantId, string date,string length,string time,int kicks)
        {
            DataTable res = _DAL.InsertKickTracker(pregnantId, date, length, time, kicks);

            if (res == null)
                return false;

            bool result = Convert.ToBoolean((int)res.Rows[0]["Result"]);
            return result;

        }

        public static bool DeleteKickTrackerByPregnantId(int pregnantId)
        {
            bool isDeleted = false;
            DataTable result = _DAL.DeleteKickTrackerByPregnantId(pregnantId);

            if (result == null)
                return isDeleted;

            isDeleted = Convert.ToBoolean((int)result.Rows[0]["Result"]);

            return isDeleted;
        }
    }
}
