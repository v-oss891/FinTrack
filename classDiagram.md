Class: User
- id
- name
- email
- password
+ register()
+ login()

Class: Transaction
- id
- userId
- amount
- type (income/expense)
- category
- date

Class: Budget
- id
- userId
- month
- limit
+ calculateUsage()

Class: Investment
- id
- userId
- principal
- rate
- duration
+ calculateROI()
+ calculateCAGR()
+ calculateCompoundInterest()

Class: AnalyticsService
+ calculateMean()
+ calculateStandardDeviation()
+ calculateSavingsRate()
