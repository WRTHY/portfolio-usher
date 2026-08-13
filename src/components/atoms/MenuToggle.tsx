type MenuToggleProps = {
  isOpen: boolean
  onClick: () => void
}

function MenuToggle({ isOpen, onClick }: MenuToggleProps) {
  return (
    <button
      type="button"
      className="menu-toggle"
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
      aria-controls="site-nav-list"
      onClick={onClick}
    >
      <span />
      <span />
      <span />
    </button>
  )
}

export default MenuToggle
