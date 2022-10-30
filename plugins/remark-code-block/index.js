// const visit = require("unist-util-visit")

// module.exports = ({ markdownAST }, pluginOptions) => {
//   visit(markdownAST, "code", (node, index, parent) => {
//     const ADDED_HEADER = `ADDED_HEADER_`
//     const { value } = node
//     let lang = node.lang || ""
//     if (lang.startsWith(ADDED_HEADER)) {
//       node.lang = lang.substring(ADDED_HEADER.length)
//       return
//     }
//     const codeContext = value
//       .replace(/"/gm, "&quot;")
//       .replace(/`/gm, "\\`")
//       .replace(/\$/gm, "\\$")

//     const headerNode = {
//       type: "html",
//       value: `<div class="remark-copy-header">
//         <div class="remark-text">${lang}</div>
//         <div class="remark-button">
//           <button class="btn btn-copy" onclick="getRemarkCopiedText(\`${codeContext}\`, this)">Copy
//           </button>
//         </div>
//       </div>`,
//     }

//     parent.children.splice(index, 0, headerNode)
//     node.lang = `${ADDED_HEADER}${lang}`
//   })
//   return markdownAST
// }
