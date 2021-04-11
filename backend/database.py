import random

def get_name():
    return random.choice(["bro","dude","yo"])

def fetch_data() -> dict:
        data = [
            {
                "user": "Anonymous",
                "location": "Panda Express",
                "review": "Tastes good",
                "rating": 9
            },
            {
                "user": "Anonymous",
                "location": "Taco Bell",
                "review": "feelsbadman",
                "rating": 3
            },
            {
                "user": "Anonymous",
                "location": "McDonald's",
                "review": "Cheap",
                "rating": 5
            }
        ]
        return data

def update(data, entry_num, us, loc, rev, rat):
    data[entry_num]["user"] = us
    data[entry_num]["location"] = loc
    data[entry_num]["review"] = rev
    data[entry_num]["rating"] = rat


def insert(data, us, loc, rev, rat):
    item = {"user": us,
            "location": loc,
            "review": rev,
            "rating": rat
            }
    data.append(item)
