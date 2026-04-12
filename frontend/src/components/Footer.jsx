function Footer() {
    return (
        <footer className="border-t border-[#222] px-9 py-6 flex items-center justify-between">
            
            <p className="text-gray-600 text-sm">© 2026 collabNotes</p>

            <a 
                href="https://www.linkedin.com/in/deepak-sharma-517279378/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-xs hover:text-blue-400 transition-all flex items-center gap-1"
            >
                <i className="devicon-linkedin-plain text-sm"></i>
                Deepak Sharma
            </a>
        </footer>
    )
}

export default Footer