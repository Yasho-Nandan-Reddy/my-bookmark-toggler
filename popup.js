// === Storage Helpers ===
function getHidden() {
    return chrome.storage.local.get("hiddenItems")
      .then(res => res.hiddenItems || []);
  }
  function setHidden(arr) {
    return chrome.storage.local.set({ hiddenItems: arr });
  }
  
  // === Build & Render the merged tree ===
  async function buildTree() {
    const treeContainer = document.getElementById("tree");
    treeContainer.innerHTML = "";
  
    // 1. live Chrome tree
    const [root] = await new Promise(res => chrome.bookmarks.getTree(res));
    const chromeRoots = root.children || [];
  
    // 2. our hidden metadata
    const hiddenList = await getHidden();
  
    // 3. merge hidden into live
    chromeRoots.forEach(node => mergeHiddenIntoNode(node, hiddenList));
  
    // 4. render it
    renderTree(chromeRoots, treeContainer, onToggle);
  }
  
  function mergeHiddenIntoNode(node, hiddenList) {
    const children = node.children || [];
    const metas = hiddenList.filter(m => m.parentId === node.id);
    const metaNodes = metas.map(m => ({
      id:       m.id,
      parentId: m.parentId,
      index:    m.index,
      title:    m.title,
      url:      m.url,
      hidden:   true,
      children: []
    }));
    const visibleNodes = children.map(c => ({ ...c, hidden: false }));
    node.children = [...visibleNodes, ...metaNodes]
      .sort((a, b) => (a.index || 0) - (b.index || 0));
    node.children.forEach(c => {
      if (!c.hidden && c.children) mergeHiddenIntoNode(c, hiddenList);
    });
  }
  
  // === Renders collapsible tree with toggle‐slider ===
  function renderTree(nodes, container, onToggle) {
    const ul = document.createElement("ul");
    for (let node of nodes) {
      const li = document.createElement("li");
      // Create a row for grid layout
      const row = document.createElement("div");
      row.className = "row";
  
      // caret or spacer
      const hasKids = node.children && node.children.length;
      let caretOrSpacer;
      if (hasKids) {
        caretOrSpacer = document.createElement("span");
        caretOrSpacer.classList.add("caret");
      } else {
        caretOrSpacer = document.createElement("span");
        caretOrSpacer.classList.add("spacer");
      }
      row.append(caretOrSpacer);
  
      // folder/bookmark icon class
      li.classList.add(node.url ? "bookmark" : "folder");
  
      // title
      const title = document.createElement("span");
      title.textContent = node.title;
      title.classList.add("title");
      row.append(title);
  
      // toggle‐slider
      const label = document.createElement("label");
      label.classList.add("switch");
      const chk = document.createElement("input");
      chk.type = "checkbox";
      chk.checked = !node.hidden;
      chk.addEventListener("change", () => onToggle(node, chk.checked));
      const slider = document.createElement("span");
      slider.classList.add("slider");
      label.append(chk, slider);
      row.append(label);
  
      li.append(row);
  
      // If caret, add click event and nested ul
      if (hasKids) {
        const nested = document.createElement("ul");
        nested.classList.add("nested");
        row.querySelector(".caret").addEventListener("click", () => {
          nested.classList.toggle("nested");
          row.querySelector(".caret").classList.toggle("caret-down");
        });
        li.append(nested);
        renderTree(node.children, nested, onToggle);
      }
      ul.append(li);
    }
    container.append(ul);
  }
  
  // === Toggle handler ===
  async function onToggle(node, nowVisible) {
    if (nowVisible) {
      // restore
      await chrome.bookmarks.create({
        parentId: node.parentId,
        index:    Number(node.index),
        title:    node.title,
        ...(node.url && { url: node.url })
      });
      let hidden = await getHidden();
      hidden = hidden.filter(m => m.id !== node.id);
      await setHidden(hidden);
    } else {
      // hide
      const hidden = await getHidden();
      hidden.push({
        id:       node.id,
        parentId: node.parentId,
        index:    node.index,
        title:    node.title,
        url:      node.url || null
      });
      await setHidden(hidden);
      if (node.url) {
        await chrome.bookmarks.remove(node.id);
      } else {
        await chrome.bookmarks.removeTree(node.id);
      }
    }
    buildTree();
  }
  
  // === Init on popup open ===
  buildTree();
  