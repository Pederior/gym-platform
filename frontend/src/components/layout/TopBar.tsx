import { FaFacebookF } from "react-icons/fa6";
import { FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

interface Colors {
  textColor: string;
  iconColor:string;
}
export default function TopBar({textColor,iconColor}:Colors) {
  return (
    <div className="px-4 py-6 flex items-center justify-between">
      <p className={`text-${textColor} text-sm`}>تماس با ما: ۰۲۱۱۲۳۴۵۶۷۸۹</p>

      <div className="flex items-center gap-3 flex-nowrap">
        <p className={`text-${textColor} text-sm`}>ما را دنبال کنید</p>

        <a
          href=""
          className={`flex items-center justify-center no-underline text-${iconColor} w-4 h-4 hover:text-red-500`}
        >
          <FaFacebookF className="w-4 h-4" />
        </a>

        <a
          href=""
          className={`flex items-center justify-center no-underline text-${iconColor} w-4 h-4 hover:text-red-500`}
        >
          <FaInstagram className="w-4 h-4" />
        </a>

        <a
          href=""
          className={`flex items-center justify-center no-underline text-${iconColor} w-4 h-4 hover:text-red-500`}
        >
          <FaTwitter className="w-4 h-4" />
        </a>

        <a
          href=""
          className={`flex items-center justify-center no-underline text-${iconColor} w-4 h-4 hover:text-red-500`}
        >
          <FaYoutube className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
