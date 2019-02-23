############################################################################
#? Uppdaterar in s.a. nyaslumpen har distinkt vilka som ska slumpas ########
############################################################################

import pymongo

#!Definition of mongo
myclient = pymongo.MongoClient("mongodb://ola:Neroxrox5(@ds121861.mlab.com:21861/foosball")
mydb = myclient['foosball']
mycol = mydb["aktiva"]

#!database-findings
dbdata = mycol.find()
print('Running')

# För varje artikel, kör loopen
for row in dbdata:
    print(x)
    # mycol.insert_one(productValues)
