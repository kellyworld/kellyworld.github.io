import json
import csv

scrabblewords = []
sortedwords = []
hivewords = [] 
hivedictionary = {}
pangrams = []
pangramdictionary = {}


with open('dictionary.csv') as dictionary:
    reader = csv.reader(dictionary, delimiter=",")
    line_count = 0
    for row in reader:
        scrabblewords.append(row)

for word in scrabblewords:
    sortedwords.append(sorted(word[0])) # there's not really any reason to sort this, but i'm too lazy to edit this part out

print(sortedwords[0:20])

for i in range(len(sortedwords)):
    good = True
    pangram = False
    letters = set()
    for letter in sortedwords[i]:
        letters.add(letter)
    if len(letters) > 7:
        good = False
    if len(letters) == 7:
        pangram = True
    if len(sortedwords[i]) < 4 or len(sortedwords[i]) > 14:
        good = False
    if good:
        if pangram:
            pangrams.append(scrabblewords[i][0])
        hivewords.append({"word": scrabblewords[i][0], "letters": sortedwords[i], "pangram?": pangram})
        hivedictionary[scrabblewords[i][0]] = sortedwords[i]

#print(pangrams)

def get_anagrams(pangram):
    anagrams = []
    pangram_letters = hivedictionary[pangram]
    for word in hivewords:
        is_anagram = True
        for letter in word.get("letters"):
            if letter not in pangram_letters:
                is_anagram = False
        if is_anagram:
            anagrams.append(word.get("word"))
    return anagrams

for word in pangrams:
    print(word)
    anagrams = get_anagrams(word)
    pangramdictionary[word] = anagrams

# print(hivedictionary)

with open("hivewords.json", "w") as outfile:
    json.dump(pangramdictionary, outfile)
