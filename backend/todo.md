**CRUD**

- [x] - User route create
- [x] - User route read
- [x] - User route list
- [x] - User route update
- [x] - User route delete

- [x] - Organization route create
- [x] - Organization route read
- [x] - Organization route list
- [x] - Organization route update
- [x] - Organization route delete

- [x] - Archetype route create
- [x] - Archetype route read
- [x] - Archetype route update
- [x] - Archetype route delete
- [x] - Archetype route list

**Services**

- [x] - Pagination
- [x] - Assessment route
- [x] - Collect assessment on chat is open/close
- [x] - Create Journal routes
- [x] - Create and process user analytics
- [x] - Collect assessment from journal
- [x] - Schedule assessment journals at 3 am
- [x] - Chat story
- [x] - Add user data to story
- [x] - Add chat limit and tell a story at the end
- [] - Add Analytics fields to assessment (date fields and slug)
- [] - Add meeting/schedule feature, where the coach can assign days they are open
- [] - Change email
- [] - Change password
- [] - Make sure disabled users and disabled teams can't access the app
- [] - Format and prettify AI answers
- [] - Make sure athlete can't access organizations and coach can't access other teams
- [] - Review the Organization options when creating an user if the currentUser is a coach or whatever

**TEST**

- [] - Test process assessment when chat is closed

**Refactors**

- [] - Verify all httpExceptions and AppErrors are well defined
- [] - Add transaction sessions everywhere possible
- [] - THINK ABOUT - change getChatChain approach to a manual input of the messages
- [] - THINK ABOUT (chat chain/memory) - giving more relevance to data retrieved from last chat
- [] - Remove files from common that are duplicated in backend
- [] - Add Vector Search Index on code
