const GIT_REGEX = /https:\/\/github\.com\/[\w\\-]+\/[\w\\-]+(\.git)?$/;
const YT_REGEX = /https:\/\/youtu\.be\/[\w\-]+$/;

function isGitUrl(url) {
  return GIT_REGEX.test(url);
}

function isYoutubeUrl(url) {
  return YT_REGEX.test(url);
}

module.exports = {
  isGitUrl,
  isYoutubeUrl,
};
