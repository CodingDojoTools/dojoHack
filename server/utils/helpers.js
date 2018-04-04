function isEmpty(data) {
  try {
    return isZero(lengthOf(data));
  } catch (e) {
    return !Boolean(data);
  }
}

function isObject(data) {
  return data && isType('object', data) && Array.isArray(data) === false;
}

function isType(type, compare) {
  return typeof compare === type;
}

function isZero(number) {
  return number === 0;
}

function lengthOf(data) {
  if (isType('string', data)) {
    data = data.trim();
  } else if (isObject(data)) {
    data = Object.keys(data);
  }

  return data.length;
}

function inRange(number, min = 0, max = 1) {
  return Math.min(min, max) <= number && number < Math.max(min, max);
}

module.exports = {
  isEmpty,
  isObject,
  isType,
  isZero,
  inRange,
};
