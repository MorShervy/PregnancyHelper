using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Models
{
    public class PregnancyAlbum
    {
        public int PregnantID { get; set; }
        public int WeekID { get; set; }
        public string PictureUri { get; set; }
        public string PictureName { get; set; }
        public string PicturePath { get; set; }
    }
}
