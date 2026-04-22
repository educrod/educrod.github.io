const path = require("path");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const eleventySass = require("eleventy-sass");
const markdownIt = require("markdown-it");
const hljs = require("highlight.js");

module.exports = function (eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(eleventySass, {
    sass: {
      loadPaths: [path.resolve(__dirname, "_sass")],
    },
  });

  // Ignore backup directory
  eleventyConfig.ignores.add("backup/**");

  // Passthrough copies
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("CNAME");

  // Group posts by translationKey for language switcher
  eleventyConfig.addCollection("postsByTranslationKey", function (collectionApi) {
    const map = {};
    collectionApi.getFilteredByTag("posts").forEach((post) => {
      const key = post.data.translationKey;
      if (key) {
        if (!map[key]) map[key] = {};
        map[key][post.data.lang] = post;
      }
    });
    return map;
  });

  // Date filter: "April 4, 2021"
  eleventyConfig.addFilter("dateFormat", function (date) {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  });

  // Excerpt filter: first <p> element of rendered HTML
  eleventyConfig.addFilter("excerpt", function (content) {
    if (!content) return "";
    const match = content.match(/<p>([\s\S]*?)<\/p>/);
    return match ? "<p>" + match[1] + "</p>" : content.slice(0, 300);
  });

  // Configure markdown-it with highlight.js for syntax highlighting
  const md = markdownIt({
    html: true,
    linkify: true,
    typographer: false,
    highlight: function (str, lang) {
      let highlighted = "";
      if (lang && hljs.getLanguage(lang)) {
        try {
          highlighted = hljs.highlight(str, {
            language: lang,
            ignoreIllegals: true,
          }).value;
        } catch (e) {}
      }
      if (!highlighted) {
        highlighted = md.utils.escapeHtml(str);
      }
      return `<div class="highlight"><pre class="highlight"><code>${highlighted}</code></pre></div>`;
    },
  });
  eleventyConfig.setLibrary("md", md);

  return {
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"],
  };
};
