/*
 * Serve JSON to our AngularJS client
 */

exports.watable_data = function(req,res) {
  res.json({
          cols: {
            userId: {
              index: 1,
              type: "number"
            },
            name: {
              index: 2,
              type: "string"
            }
          },
          rows: [
            {
              userId: 1,
              name: "Batman"
            },
            {
              userId: 2,
              name: "Superman"
            }
          ]
    })
}

exports.name = function (req, res) {
  res.json(
      {
        name: 'Nodes-Talking Administration'
      }
  )
}
