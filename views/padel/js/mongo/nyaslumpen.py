############################################################################
#? Uppdaterar in s.a. nyaslumpen har distinkt vilka som ska slumpas ########
############################################################################

import pymongo

#!Definition of mongo
myclient = pymongo.MongoClient("mongodb://ola:Neroxrox5(@ds121861.mlab.com:21861/padel")
mydb = myclient['padel']
mycol = mydb["aktiva"]

#!database-findings
dbdata = mycol.find()
print('Running')

# För varje artikel, kör loopen
for row in dbdata:
    print(row)
    mycol.update_one({$set:{'Aktiv':true}})
