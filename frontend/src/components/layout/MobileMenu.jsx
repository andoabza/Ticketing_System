export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mobile-menu">
      <IconButton onClick={() => setIsOpen(!isOpen)}>
        <MenuIcon />
      </IconButton>

      <Drawer anchor="left" open={isOpen} onClose={() => setIsOpen(false)}>
        <nav className="mobile-nav">{/* Navigation links */}</nav>
      </Drawer>
    </div>
  );
}
