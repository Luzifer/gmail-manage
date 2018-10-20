// getHashedFilters returns a dictionary of all present filters with
// sha256 hashes as keys
function getHashedFilters() {
  let resp = Gmail.Users.Settings.Filters.list("me")
  let hashedFilters = {}

  for (let i = 0; i < resp.filter.length; i++) {
    let filter = resp.filter[i]
    hashedFilters[hashFilter(filter)] = filter
  }

  return hashedFilters
}

// getOrCreateLabel fetches a label by name or creates a new one if it does not exist
function getOrCreateLabel(name) {
  let labels = parseCacheResponse(CacheService.getScriptCache().get("labels"))
  if (labels === null) {
    labels = Gmail.Users.Labels.list("me").labels
    CacheService.getScriptCache().put("labels", JSON.stringify(labels), 60)
  }

  for (let i = 0; i < labels.length; i++) {
    let label = labels[i]
    if (label.name == name) {
      return label
    }
  }

  // Invalidate cache, needs to be reloaded next time
  CacheService.getScriptCache().remove("labels")

  return Gmail.Users.Labels.create({
    labelListVisibility: "labelShow",
    messageListVisibility: "show",
    name: name,
  }, "me")
}

// hashFilter returns a hash to the filter dictionary given for comparison
function hashFilter(filter) {
  let obj = {}

  if (filter.criteria.query) obj["crit.query"] = filter.criteria.query
  if (filter.action.addLabelIds) obj["act.add"] = filter.action.addLabelIds.join("|")
  if (filter.action.removeLabelIds) obj["act.del"] = filter.action.removeLabelIds.join("|")

  return sha256sum(JSON.stringify(obj))
}

// parseCacheResponse unmarshals the JSON string from the cache if any
function parseCacheResponse(resp) {
  if (resp === null) return null
  return JSON.parse(resp)
}

// resolveLabelIDToName determines the name of a label to a given ID
function resolveLabelIDToName(id) {
  let labels = parseCacheResponse(CacheService.getScriptCache().get("labels"))
  if (labels === null) {
    labels = Gmail.Users.Labels.list("me").labels
    CacheService.getScriptCache().put("labels", JSON.stringify(labels), 60)
  }

  for (let i = 0; i < labels.length; i++) {
    let label = labels[i]
    if (label.id == id) {
      return label.name
    }
  }

  return null
}

// sha256sum calculates a hex digest from the input string
function sha256sum(input) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, input)
    .map((chr) => {
      return (chr + 256).toString(16).slice(-2)
    }).join('')
}

// trashByQuery moves messages matching a query to trash
function trashByQuery(query) {
  let threads = []
  let removedThreads = 0

  do {
    threads = GmailApp.search(query)
    for (let i = 0; i < threads.length; i++) {
      let thread = threads[i]
      thread.moveToTrash()
      removedThreads++
    }
  } while (threads.length > 0 && removedThreads < MAX_DELETE_PER_LOOP)

  Logger.log('Removed %s threads for query "%s"', removedThreads, query)
}
