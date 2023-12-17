import sys
import json

# Első parancssori argumentum a paraméter, amit átadtunk
parameter_from_nodejs = sys.argv[1] if len(sys.argv) > 1 else "Nincs megadva paraméter"

print("Python script futtatva Node.js-ből.")
print("Paraméter átadva Pythonnak:", parameter_from_nodejs)

# Példa: A Python válasz egy JSON objektummal
response_data = {
    'someKey': 'Ez egy példa érték a válaszból',
    'anotherKey': 'Másik példa érték'
}

# A válasz JSON formátumban kerül visszaadásra
print(json.dumps(response_data))