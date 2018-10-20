// Apps Scripts may only run for ~5m so we limit the execution
var MAX_DELETE_PER_LOOP = 1000

// Label constants (these are label NAMES to be used with getOrCreateLabel)
var labelImportant = "IMPORTANT"
var labelInbox = "INBOX"
var labelSpam = "SPAM"
var labelStarred = "STARRED"
var labelTrash = "TRASH"
var labelUnread = "UNREAD"

var labelCatForums = "CATEGORY_FORUMS"
var labelCatPersonal = "CATEGORY_PERSONAL"
var labelCatPromotions = "CATEGORY_PROMOTIONS"
var labelCatSocial = "CATEGORY_SOCIAL"
var labelCatUpdates = "CATEGORY_UPDATES"
