var config = {

  // In here you will define queries to execute and delete threads
  // matched. All threads are moved to trash so you have the chance
  // to recover them but you should test the queries before!
  cleanup_queries: [
    "label:newsletter older_than:6m",
    "older_than:10y",
  ],

  // These filter definitions are applied inside your Gmail settings
  // in the "Filters and Blocked Addresses" tab. Currently only the
  // "query" criteria is supported. Also the actions are wrappers
  // for the real API so you don't need to specify the label IDs in
  // here but can use label names.
  // All non-existent labels will be created during the apply-run.
  filters: [
    // Move LetsEncrypt mails to specific label
    {
      criteria: {
        query: "from:@letsencrypt.org",
      },
      action: {
        add_labels: ["LetsEncrypt"],
        remove_labels: [labelInbox],
      },
    },

    // Move Github mails to specific label
    {
      criteria: {
        query: "from:github.com",
      },
      action: {
        add_labels: ["Github"],
        remove_labels: [labelInbox],
      },
    },

    // Build a bigger multi-condition filter and delete those mails
    {
      criteria: {
        query: "(" + [
          "from:@example.com",
          "from:news@annoying-sender.com",
        ].join(" OR ") + ")",
      },
      action: {
        add_labels: [labelTrash],
      },
    },

  ],
}
