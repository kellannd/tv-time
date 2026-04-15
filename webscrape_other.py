from urllib.request import Request, urlopen
from bs4 import BeautifulSoup
import subprocess

import requests
import json
import re

# episodes = ["Red-Handed", "Heart_of_Darkness", "Hat_Trick", "The_Stable_Boy", "The_Return","The_Stranger"]

# episodes = ["Skin_Deep"]

episodes = ["A_Tale_of_Two_Sisters", "White_Out"]

for ep in episodes:
    url = "https://onceuponatime.fandom.com/api.php"

    params = {
        "action": "parse",
        "page":  ep + "/Transcript",
        "format": "json"
    }

    response = requests.get(url, params=params)
    data = response.json()

    html = data["parse"]["text"]["*"]

    soup = BeautifulSoup(html, "html.parser")

    content = soup.find("div", class_="mw-parser-output")

    td = content.find_all("td")

    bold = td[4].find_all("center")

    sceneNum = 0
    scenes = []
    sceneDesc = ""
    sceneDialog = []
    regex = r"\b[\w']+\b"
    tense = ""
    loc = ""

    for child in content:

        # breaks up by scene
        if child.name == "center" and "SCENE" in child.get_text():
            sceneDesc = child.get_text().replace("SCENE: ", "")

            print(sceneDesc)

            if "Present" in sceneDesc:
                tense = "Present"
            elif "Past" in sceneDesc:
                tense = "Past"
            else:
                tense = None

            if "The Enchanted Forest" in sceneDesc:
                loc = "The Enchanted Forest"
            elif "Storybrooke" in sceneDesc:
                loc = "Storybrooke"
            else:
                loc = None

            if '\n\n' in sceneDesc:
                sceneDesc = sceneDesc.replace("\n\n", "")
            if '\n' in sceneDesc:
                sceneDesc = sceneDesc.replace("\n", " ")
            sceneNum = sceneNum + 1
        elif child.name != "center" and child.name != None:
            sceneDialog = []

            # goes through each line of dialog
            if child.name == "p":

                scene = child
                character = ""
                charDialog = ""
                for line in scene:
                    if line.name == "b":
                        if character != "":
                            text = re.findall(regex, charDialog)
                            sceneDialog.append({"character": character, "dialog": charDialog, "dialogSplit": text})
                            character = str(line.get_text()).removesuffix(':')
                            charDialog = ""
                        else:
                            character = str(line.get_text()).removesuffix(':')
                    else:
                        if (line.name == "i" and "(" in line.get_text()) or line.name == "br":
                            continue
                        else:
                            text = line.get_text()

                            if text != ' ' and text != '\n':
                                if '\n' in text:
                                    text = text.replace("\n", "")

                                if '\n\n' in text:
                                    text = text.replace('\n\n', "")
                                # charDialog.append(text)
                                if "Mr. " in text:
                                    text = text.replace("Mr. ", "Mr")


                                if "Mrs. " in text:
                                    text = text.replace("Mrs. ", "Mrs")


                                charDialog = charDialog + str(text)

                        #print(str(line.get_text()))
                text = re.findall(regex, charDialog)
                sceneDialog.append({"character": character, "dialog": charDialog, "dialogSplit": text })
                scenes.append({"sceneDesc": sceneDesc, "tense": tense, "location": loc, "dialog": sceneDialog})

    episode = {"episode": ep, "scenes": scenes}



    file = "scripts/" + ep + ".json"
    # print(ep_count)

    # ep_count = ep_count + 1

    with open(file, "w") as f:
        json.dump(episode, f)
