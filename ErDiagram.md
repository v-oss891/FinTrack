Entities:

User
- id (Primary Key)
- name
- email
- password

Transaction
- id (Primary Key)
- user_id (Foreign Key)
- amount
- type
- category
- date

Budget
- id (Primary Key)
- user_id (Foreign Key)
- month
- limit

Investment
- id (Primary Key)
- user_id (Foreign Key)
- principal
- rate
- duration

Relationships:

User 1 --- * Transaction
User 1 --- * Budget
User 1 --- * Investment
