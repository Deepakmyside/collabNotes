import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
function Footer() {
  return (
    <footer className="border-t border-edge px-6 py-5">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        
        <p className="text-ink-2 text-xs">
          © 2026 collabNotes
        </p>
         <div className="flex gap-3">
                  <a
            href="https://github.com/thislinkdoesnotexist999"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-ink-2 text-xs hover:text-ink transition"
          >
            <FaGithub className="w-5 h-5" />
            
          </a>


        <a
          href="https://www.linkedin.com/in/deepak-sharma-517279378/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-ink-2 text-xs hover:text-ink transition"
        >
          <FaLinkedin className="w-5 h-5" />
          <span>Deepak Sharma</span>
        </a>
         </div>
      </div>
    </footer>
  );
}

export default Footer
