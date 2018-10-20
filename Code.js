// Apps Scripts may only run for ~5m so we limit the execution
var MAX_DELETE_PER_LOOP = 1000

function cleanup() {
  trashByQuery("label:crontab  older_than:6m")
  trashByQuery("label:newsletter older_than:6m")
  trashByQuery("label:social-media older_than:2y")
  trashByQuery("older_than:10y")
}

function trashByQuery(query) {
  var threads = []
  var removedThreads = 0

  do {
    threads = GmailApp.search(query)
    for (var i = 0; i < threads.length; i++) {
      var thread = threads[i]
      thread.moveToTrash()
      removedThreads++
    }
  } while (threads.length > 0 && removedThreads < MAX_DELETE_PER_LOOP)

  Logger.log('Removed %s threads for query "%s"', removedThreads, query)
}
