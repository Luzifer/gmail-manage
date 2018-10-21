// executeMailCleanup takes the queries defined in config and deletes
// mails matched by those filters
function executeMailCleanup() {
  console.log("Starting mail cleanup...")

  for (let i = 0; i < config.cleanup_queries.length; i++) {
    let query = config.cleanup_queries[i]
    let removedThreads = trashByQuery(query)
    console.log('Removed %d threads for query "%s"', removedThreads, query)
  }
}

// applyFilterDefinition takes the filter definitions from the config
// matches them to the filters already defined in the Gmail account
// and afterwards applies reqired changes
function applyFilterDefinition() {
  console.log("Starting to apply filters...")

  let presentFilters = getHashedFilters()
  let definedFilters = {}

  for (let i = 0; i < config.filters.length; i++) {
    let filter = config.filters[i]

    if (filter.action.add_labels) {
      filter.action.addLabelIds = filter.action.add_labels.map((name) => {
        return getOrCreateLabel(name).id
      })
      delete filter.action.add_labels
    }

    if (filter.action.remove_labels) {
      filter.action.removeLabelIds = filter.action.remove_labels.map((name) => {
        return getOrCreateLabel(name).id
      })
      delete filter.action.remove_labels
    }

    definedFilters[hashFilter(filter)] = filter
  }

  let removedFilters = 0
  let createdFilters = 0

  for (let hash in presentFilters) {
    if (hash in definedFilters) continue
    Gmail.Users.Settings.Filters.remove("me", presentFilters[hash].id)
    console.log(["Removed filter", presentFilters[hash]])
    removedFilters++
  }

  for (let hash in definedFilters) {
    if (hash in presentFilters) continue
    Gmail.Users.Settings.Filters.create(definedFilters[hash], "me")
    console.log(["Created filter", definedFilters[hash]])
    createdFilters++
  }

  console.log("%d filters removed, %d filters created, %d filters untouched", removedFilters, createdFilters, presentFilters.length - removedFilters)
}
