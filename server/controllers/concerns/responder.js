function responder(response, as) {
  return function(error, data) {
    if (error) {
      console.log(`[RESPONDER] Errored with ${error}`);
      return sendServerError(error, response);
    }

    console.log(`[RESPONDER] Sending ${JSON.stringify(data)} as ${as}`);

    response.json({ [as]: data });
  };
}

module.exports = responder;
