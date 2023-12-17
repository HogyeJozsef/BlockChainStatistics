



# main.py


from web3 import Web3

# Setup
alchemy_url = "https://eth-mainnet.g.alchemy.com/v2/<API KEY>"
w3 = Web3(Web3.HTTPProvider(alchemy_url))

 
# Get the information of a transaction
tx = w3.eth.get_transaction('0x5b94f3b5c410bd4bb87d9a02ec9d23825b21ec61ad1fee00970c4b5dff332d98')

#print(tx)
hex_string = tx.input.hex()

hex_stringA = hex_string[0:10]

hex_stringB = hex_string[71:74]
h_sB = int(hex_stringB, base=16)

hex_stringC = hex_string[134:138]
h_sC = int(hex_stringC, base=16)

h_sD =0
if (len(hex_string) >138):
    hex_stringD = hex_string[199:202]
    h_sD = int(hex_stringD, base=16)


print(hex_string)
print(hex_stringA + " " + str(h_sB) + " " + str(h_sC) + " " + str(h_sD))

#0x1fd979e0 batch
#0x635d70f4 sima mint

 


