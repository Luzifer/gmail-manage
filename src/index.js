// executeMailCleanup takes the queries defined in config and deletes
// mails matched by those filters
function executeMailCleanup() {
  for (let i = 0; i < config.cleanup_queries.length; i++) {
    let query = config.cleanup_queries[i]
    trashByQuery(query)
  }
}

// applyFilterDefinition takes the filter definitions from the config
// matches them to the filters already defined in the Gmail account
// and afterwards applies reqired changes
function applyFilterDefinition() {
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

  for (let hash in presentFilters) {
    if (hash in definedFilters) continue
    Gmail.Users.Settings.Filters.remove("me", presentFilters[hash].id)
    Logger.log(["Removed filter", presentFilters[hash]])
  }

  for (let hash in definedFilters) {
    if (hash in presentFilters) continue
    Gmail.Users.Settings.Filters.create(definedFilters[hash], "me")
    Logger.log(["Created filter", definedFilters[hash]])
  }
}
