import numpy as np
import pickle
from pymongo import MongoClient, errors
from dateutil.parser import parse
from sklearn.svm import SVR

# use svm to curve traffic data and predict delay for route direction
# author: Yichen
MODEL_PATH = "";
def get_data():
    client = MongoClient('localhost', 27017);
    db = client.test;
    incidents = db.incidents;
    feature = [];
    delay = [];
    for doc in incidents.find():
        if 'delayFromTypical' not in doc:
            continue;
        # parse string into datetime object
        st, et = parse(doc['startTime']), parse(doc['endTime']);
        if (st.day < et.day and st.hour <= et.hour):
            for hr in range(0, 24):
                data = (hr, doc['location']['lat'], doc['location']['lng']);
                feature.append(data);
                delay.append(doc['delayFromTypical']);
        else:
            for hr in range(st.hour, et.hour + (et.day - st.day) * 24 + 1):
                data = (hr % 24, doc['location']['lat'], doc['location']['lng']);
                feature.append(data);
                delay.append(doc['delayFromTypical']);
        #print doc['startTime'] + "\t" + doc['endTime'] + "\t" + str(doc['location']['lat']) + "\t" + str(doc['location']['lng']);
    feature = np.array(feature);
    delay = np.array(delay);
    print str(feature.__len__()) + "\t" + str(delay.__len__());
    print feature;
    return;
def svm_train():
    return;

def svm_predict(time = 0, lat = 43, lng = 43):
    return;

def dump():
    return;
def load():
    return;
def test():
    feature = [];
    delay = [];
    doc = {
        "startTime" : "2016-11-23T17:00:00",
        "endTime" : "2016-11-23T018:00:00",
        "delayFromTypical" : 0.16,
        "location" : {
            "lat" : 40.486099,
            "lng" : -74.452202
            }
        };
    if 'delayFromTypical' not in doc:
        return;
    # parse string into datetime object
    st, et = parse(doc['startTime']), parse(doc['endTime']);
    if (st.day < et.day and st.hour <= et.hour):
        for hr in range(0, 24):
            data = (hr, doc['location']['lat'], doc['location']['lng']);
            feature.append(data);
            delay.append(doc['delayFromTypical']);
    else:
        for hr in range(st.hour, et.hour + (et.day - st.day) * 24 + 1):
            data = (hr % 24, doc['location']['lat'], doc['location']['lng']);
            feature.append(data);
            delay.append(doc['delayFromTypical']);
    feature = np.array(feature);
    delay = np.array(delay);
    print "feature: \n";
    print feature;
    print "delay: \n";
    print delay;
if __name__ == "__main__":
    test();