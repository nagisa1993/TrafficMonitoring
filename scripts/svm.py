import numpy as np
import pickle
from pymongo import MongoClient, errors
from dateutil.parser import parse
from sklearn import preprocessing
from sklearn.preprocessing import PolynomialFeatures
from sklearn.feature_extraction import DictVectorizer
from sklearn.neural_network import MLPRegressor
from sklearn.model_selection import train_test_split

###########################################################
# use svm to curve traffic data and predict delay for route direction
# author: Yichen
###########################################################

def get_data():
    client = MongoClient('localhost', 27017);
    db = client.test;
    incidents = db.incidents;
    delaydict = {};
    cntdict = {};
    feature = [];
    delay = [];
    for doc in incidents.find():
        if doc['type'] != 'Congestion/Flow':
            continue;
        if 'delayFromTypical' not in doc:
            continue;
        # invalid input
        if doc['startTime'] > doc['endTime']:
            print "time invalid errors";
            continue;
        # parse string into datetime object
        st, et = parse(doc['startTime']), parse(doc['endTime']);
        # input time covers the whole day.
        if st.day < et.day and st.hour <= et.hour:
            for hr in range(0, 24):
                # data = [hr, doc['location']['lat'], doc['location']['lng']];
                # data = {'time': hr % 24, 'road': doc['toLocation'], 'severity': doc['severity'],
                #         'lat': doc['location']['lat'], 'lng': doc['location']['lat']};
                # feature.append(data);
                # delay.append(doc['delayFromTypical']);
                if (doc['roadName'], hr % 24, doc['severity']) not in delaydict:
                    delaydict[(doc['roadName'], hr % 24, doc['severity'])] = 0;
                    cntdict[(doc['roadName'], hr % 24, doc['severity'])] = 0;
                delaydict[(doc['roadName'], hr % 24, doc['severity'])] += doc['delayFromTypical'];
                cntdict[(doc['roadName'], hr % 24, doc['severity'])] += 1;
        else:
            for hr in range(st.hour, et.hour + (et.day - st.day) * 24 + 1):
                # data = [hr % 24, doc['location']['lat'], doc['location']['lng']];
                # data = {'time': hr % 24, 'road': doc['toLocation'], 'severity': doc['severity'],
                #         'lat': doc['location']['lat'], 'lng': doc['location']['lat']};
                # feature.append(data);
                # delay.append(doc['delayFromTypical']);
                if (doc['roadName'], hr % 24, doc['severity']) not in delaydict:
                    delaydict[(doc['roadName'], hr % 24, doc['severity'])] = 0;
                    cntdict[(doc['roadName'], hr % 24, doc['severity'])] = 0;
                delaydict[(doc['roadName'], hr % 24, doc['severity'])] += doc['delayFromTypical'];
                cntdict[(doc['roadName'], hr % 24, doc['severity'])] += 1;
        #print doc['startTime'] + "\t" + doc['endTime'] + "\t" + str(doc['location']['lat']) + "\t" + str(doc['location']['lng']);
    # print delaydict;
    # print cntdict;
    for key, value in delaydict.iteritems():
        data = {'road': key[0], 'time': key[1], 'severity': key[2]};
        feature.append(data);
        avg = delaydict[key] / cntdict[key];
        delay.append(avg);
    vec = DictVectorizer();
    feature = np.array(feature);
    feature = vec.fit_transform(feature).toarray();
    delay = np.array(delay, dtype=float);
    # scaler = preprocessing.StandardScaler().fit(feature);
    # poly = PolynomialFeatures(2);
    # print feature;
    # print delay;
    return feature, delay;
    # return;
    # return scaler.transform(feature), delay;
    # return poly.fit_transform(feature), delay;
def svm_train():
    feature, delay = get_data();
    print feature.shape;
    print delay.shape;
    X_train, X_test, y_train, y_test = train_test_split(feature, delay, test_size=0.05);
    mlp_adam = MLPRegressor(solver='lbfgs', activation='logistic', learning_rate='constant', learning_rate_init=0.1,
                            max_iter=1000).fit(X_train,y_train);
    print "test_size: " + str(0.05) + "\trate: " + str(mlp_adam.score(X_test, y_test)) + "\tloss: " + str(mlp_adam.loss_);
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
        "startTime": "2016-11-23T17:34:00",
        "endTime": "2016-11-23T17:45:00",
        "delayFromTypical": 2.16,
        "location": {
            "lat": 40.486099,
            "lng": -74.452202
            }
        };
    if 'delayFromTypical' not in doc:
        return;
    # invalid input
    if doc['startTime'] >= doc['endTime']:
        print "time invalid errors";
        return;
    # parse string into datetime object
    st, et = parse(doc['startTime']), parse(doc['endTime']);
    # input time covers the whole day.
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
    delay = np.array(delay).reshape(delay.__len__(), 1);
    print "feature: ";
    print feature;
    print "\ndelay: ";
    print delay;
    print delay.shape[0];
if __name__ == "__main__":
    svm_train();