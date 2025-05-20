# Bookmark Visibility Manager

A Chrome extension to visually manage the visibility of your bookmarks and folders using a collapsible, tree-style interface with toggles. Hide or restore bookmarks and folders with a single click, and keep your bookmarks bar clean and organized.

---

## Features
- **Tree View:** Displays all your bookmarks and folders in a collapsible tree structure.
- **Toggle Visibility:** Instantly hide or restore any bookmark or folder using a slider switch.
- **Caret Navigation:** Expand/collapse folders with a caret (▶) for easy navigation.
- **Icons:** Clear folder (📁) and bookmark (🔖) icons for quick identification.
- **Persistent State:** Hidden items are remembered using Chrome's local storage.
- **Modern UI:** Clean, responsive design using CSS Grid for perfect alignment.

---

## Installation
1. **Clone or Download** this repository:
   ```sh
   git clone https://github.com/YOUR_USERNAME/my-bookmark-toggler.git
   cd my-bookmark-toggler
   ```
2. **Open Chrome** and go to `chrome://extensions/`.
3. Enable **Developer mode** (top right).
4. Click **Load unpacked** and select the project folder.
5. The extension icon will appear in your Chrome toolbar.

---

## Usage
- Click the extension icon to open the popup.
- Browse your bookmarks in a tree view.
- Click the **caret (▶)** to expand/collapse folders.
- Use the **toggle slider** to hide or restore bookmarks/folders.
- Hidden items are removed from the Chrome bookmarks bar but can be restored anytime.

---

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

---

## Credits
- Built with [Chrome Extensions API](https://developer.chrome.com/docs/extensions/)
- UI inspired by classic file explorers
