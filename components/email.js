



db.emails.watch([
    { $match: {
      "operationType": "update",
      "updateDescription.updatedFields.sendNow": true
    } },
    { $project: {
      documentKey: 1
    } }
  ]).pretty()