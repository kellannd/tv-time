import json
import os
from collections import defaultdict

data_dir = "data/scripts"
seasons = ["season1", "season2", "season3"]

full_info = []

for season in seasons:
    season_path = os.path.join(data_dir, season)
    for filename in os.listdir(season_path):
        if not filename.endswith(".json"):
            continue
        filepath = os.path.join(season_path, filename)


        with open(filepath, "r") as file:
            data = json.load(file)

        ep_characters = []
        count = 1
        scene_characters = []

        ep_title = data["episode"].replace("_", " ")
        ep_title = ep_title.replace(" (Episode)", "")
        # print(ep_title)
        # print(season)

        presentCount = 0
        pastCount = 0
        otherTenseCount = 0

        sbCount = 0
        efCount = 0
        otherLocCount = 0

        ep_Scenes = []
        for scene in data["scenes"]:

            tempScene = {
                "tense": scene["tense"],
                "location": scene["location"]
            }

            ep_Scenes.append(tempScene)

            temp = []

            if scene["tense"] == "Present":
                presentCount = presentCount + 1

            elif scene["tense"] == "Past":
                pastCount = pastCount + 1

            else:
                otherTenseCount = otherTenseCount + 1

            if scene["location"] == "The Enchanted Forest":
                efCount = efCount + 1

            elif scene["location"] == "Storybrooke":
                sbCount = sbCount + 1

            else:
                otherLocCount = otherLocCount + 1

            for line in scene["dialog"]:

                if line["character"] not in temp:
                    temp.append(line["character"])
                if line["character"] not in ep_characters:
                    ep_characters.append(line["character"])

            scene_characters.append({count: temp})
            count = count + 1

        # print(scene_characters)
        # print(ep_characters)

        sceneInfo = {
            "episode": ep_title,
            "season": season,
            "SB_Count": sbCount,
            "EF_Count": efCount,
            "Other_Loc_Count": otherLocCount,
            "PresentScenes": presentCount,
            "PastScenes": pastCount,
            "OtherScenes": otherTenseCount,
            "Scenes": ep_Scenes
        }

        print(sceneInfo)

        full_info.append(sceneInfo)
        # print("Storybrook: ", sbCount)
        # print("The Enchanted Forest: ", efCount)
        # print("Other: ", otherLocCount)
        # print("Present Scenes: ", presentCount)
        # print("Past Scenes: ", pastCount)
        # print("Other: ", otherTenseCount)
        print("\n")


with open("scenes_info.json", "w") as file:
    json.dump(full_info, file)
