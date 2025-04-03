import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faFacebook,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="sticky bottom-7 w-full z-10 transition-opacity max-w-[840px] m-auto duration-500 flex justify-center items-center py-4 bg-gradient-to-r from-[#373f51] to-[#1b1b1e] rounded-full shadow-lg">
      <div className="flex space-x-10 h-[20px]">
        <a
          href="https://github.com/Rhixin"
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer w-[20px]"
        >
          <FontAwesomeIcon icon={faGithub} size="lg" className="text-white" />
        </a>

        <a
          href="https://www.facebook.com/zhaztedrhixin.valles/"
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer  w-[20px]"
        >
          <FontAwesomeIcon icon={faFacebook} size="lg" className="text-white" />
        </a>

        <a
          href="https://www.linkedin.com/in/rhixin-valles-051152258/"
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer  w-[20px]"
        >
          <FontAwesomeIcon icon={faLinkedin} size="lg" className="text-white" />
        </a>
      </div>
    </footer>
  );
}
