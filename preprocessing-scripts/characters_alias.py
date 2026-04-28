import json
import os
from collections import defaultdict

data_dir = "data/scripts"
seasons = ["season1", "season2", "season3"]


ALIAS_MAP = {
    
    "Emma": "Emma Swan",
    "Emma:": "Emma Swan",
    "EMMA": "Emma Swan",
    "Emma Swan": "Emma Swan",

  
    "Mary Margaret": "Snow White / Mary Margaret",
    "Mary Margaret:": "Snow White / Mary Margaret",
    "Mary Margaret'": "Snow White / Mary Margaret",
    "Mary Margret": "Snow White / Mary Margaret",
    "Mary Maragaret": "Snow White / Mary Margaret",
    "Mary Margaret Blanchard": "Snow White / Mary Margaret",
    "Mary": "Snow White / Mary Margaret",
    "Snow White": "Snow White / Mary Margaret",
    "Snow White:": "Snow White / Mary Margaret",
    "Snow": "Snow White / Mary Margaret",
    "snow.": "Snow White / Mary Margaret",
    "Young Snow White": "Snow White / Mary Margaret",

  
    "David": "Prince Charming / David",
    "David:": "Prince Charming / David",
    "David Nolan": "Prince Charming / David",
    "Prince Charming": "Prince Charming / David",
    "Prince Charming:": "Prince Charming / David",
    "Prince Prince Charming": "Prince Charming / David",
    "Charming": "Prince Charming / David",
    "Night Root David": "Prince Charming / David",

   
    "Mr. Gold": "Rumplestiltskin / Mr. Gold",
    "Mr. Gold:": "Rumplestiltskin / Mr. Gold",
    "Mr.Gold": "Rumplestiltskin / Mr. Gold",
    "Mr Gold": "Rumplestiltskin / Mr. Gold",
    "Mr, Gold": "Rumplestiltskin / Mr. Gold",
    "Gold": "Rumplestiltskin / Mr. Gold",
    "Rumplestiltskin": "Rumplestiltskin / Mr. Gold",
    "Rumplestiltskin:": "Rumplestiltskin / Mr. Gold",
    "Rumplestilskin": "Rumplestiltskin / Mr. Gold",
    "Rumplstiltskin": "Rumplestiltskin / Mr. Gold",
    "Rumplesttiltskin": "Rumplestiltskin / Mr. Gold",
    "The Crocodile": "Rumplestiltskin / Mr. Gold",
    "Crocodile": "Rumplestiltskin / Mr. Gold",

  
    "Regina": "Regina / Evil Queen",
    "Regina:": "Regina / Evil Queen",
    "Regina Mills": "Regina / Evil Queen",
    "Regina (voice-over)": "Regina / Evil Queen",
    "Evil Queen": "Regina / Evil Queen",
    "Evil Queen:": "Regina / Evil Queen",
    "The Evil Queen": "Regina / Evil Queen",
    "Queen Regina": "Regina / Evil Queen",

   
    "Hook": "Hook / Killian Jones",
    "Hook:": "Hook / Killian Jones",
    "Captain Hook": "Hook / Killian Jones",
    "Killian": "Hook / Killian Jones",
    "Killian Jones": "Hook / Killian Jones",
    "Kilian": "Hook / Killian Jones",
    "Past Hook": "Hook / Killian Jones",

   
    "Neal": "Neal / Baelfire",
    "Neal Cassidy": "Neal / Baelfire",
    "Baelfire": "Neal / Baelfire",
    "Baelfire:": "Neal / Baelfire",

   
    "Belle": "Belle",
    "Belle French": "Belle",

  
    "Henry": "Henry",
    "Henry:": "Henry",
    "Henry;": "Henry",
    "Henry Mills": "Henry",
    "Henry (VO)": "Henry",
    "Prince Henry": "Henry",

    
    "Cora": "Cora / Queen of Hearts",
    "Cora:": "Cora / Queen of Hearts",
    "Queen of Hearts": "Cora / Queen of Hearts",

  
    "Ruby": "Red / Ruby",
    "Red": "Red / Ruby",
    "Red Riding Hood": "Red / Ruby",

  
    "Archie": "Jiminy Cricket / Archie",
    "Archie:": "Jiminy Cricket / Archie",
    "Archie.": "Jiminy Cricket / Archie",
    "Archie Hopper": "Jiminy Cricket / Archie",
    "Jiminy": "Jiminy Cricket / Archie",
    "Jiminy Cricket": "Jiminy Cricket / Archie",

   
    "Grumpy": "Grumpy / Leroy",
    "Leroy": "Grumpy / Leroy",
    "Dreamy": "Grumpy / Leroy",

   
    "Geppetto": "Geppetto / Marco",
    "Marco": "Geppetto / Marco",

    
    "Blue Fairy": "Blue Fairy",
    "Blue fairy": "Blue Fairy",
    "Mother Superior": "Blue Fairy",

    
    "Sheriff Graham": "Graham / The Huntsman",
    "Sheriff Graham:": "Graham / The Huntsman",
    "Graham": "Graham / The Huntsman",
    "Huntsman": "Graham / The Huntsman",
    "The Huntsman": "Graham / The Huntsman",

  
    "Pan": "Peter Pan",
    "Peter Pan": "Peter Pan",

    
    "Jefferson": "Jefferson / Mad Hatter",
    "Mad Hatter": "Jefferson / Mad Hatter",

    
    "August": "August / Pinocchio",
    "August Booth": "August / Pinocchio",
    "Pinocchio": "August / Pinocchio",

    "Kathryn": "Kathryn / Princess Abigail",
    "Princess Abigail": "Kathryn / Princess Abigail",

    
    "Sidney": "Sidney / Magic Mirror",
    "Magic Mirror": "Sidney / Magic Mirror",
    "Genie": "Sidney / Magic Mirror",

    "Dr. Whale": "Dr. Whale / Frankenstein",
    "Dr. Whale:": "Dr. Whale / Frankenstein",
    "Dr. Frankenstein": "Dr. Whale / Frankenstein",
    "Whale": "Dr. Whale / Frankenstein",

    
    "Zelena": "Zelena / Wicked Witch",
    "Wicked Witch": "Zelena / Wicked Witch",
    "The Wicked Witch": "Zelena / Wicked Witch",
    "he Wicked Witch": "Zelena / Wicked Witch",
    "Wicked Witch of the West": "Zelena / Wicked Witch",
}


multi_speakers = {
    "Hook and David (at the same time)": ["Hook / Killian Jones", "Prince Charming / David"],
    "David and Mary Margaret":            ["Prince Charming / David", "Snow White / Mary Margaret"],
    "Mary Margaret and Belle":            ["Snow White / Mary Margaret", "Belle"],
    "Emma and Henry":                     ["Emma Swan", "Henry"],
    "Regina and Devin":                   ["Regina / Evil Queen"],
}

def resolve(raw_name):
   
    if raw_name in multi_speakers:
        return multi_speakers[raw_name]
    main_name = ALIAS_MAP.get(raw_name)
    if main_name:
        return [main_name]
    return [raw_name]  

character_lines = defaultdict(int)
character_episodes = defaultdict(set)

for season in seasons:
    season_path = os.path.join(data_dir, season)
    for filename in os.listdir(season_path):
        if not filename.endswith(".json"):
            continue
        filepath = os.path.join(season_path, filename)
        with open(filepath, encoding="utf-8") as f:
            episode_data = json.load(f)
        episode_name = f"{season}/{episode_data['episode']}"
        for scene in episode_data.get("scenes", []):
            for line in scene.get("dialog", []):
                raw = line["character"].strip()
                if not raw:
                    continue
                for char in resolve(raw):
                    character_lines[char] += 1
                    character_episodes[char].add(episode_name)

result = [
    {
        "character": char,
        "lines": character_lines[char],
        "episodes": len(character_episodes[char])
    }
    for char in character_lines
]

result.sort(key=lambda x: x["lines"], reverse=True)

os.makedirs("data", exist_ok=True)
with open("data/character_stats.json", "w", encoding="utf-8") as f:
    json.dump(result, f, indent=2)

for r in result[:20]:
    print(f"  {r['character']}: {r['lines']} lines, {r['episodes']} episodes")
