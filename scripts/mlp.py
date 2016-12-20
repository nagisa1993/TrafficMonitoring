import numpy as np
import pickle
from pymongo import MongoClient, errors
from dateutil.parser import parse
from sklearn import preprocessing
from sklearn.preprocessing import PolynomialFeatures
from sklearn.externals import joblib
from sklearn.feature_extraction import DictVectorizer
from sklearn.neural_network import MLPRegressor
from sklearn.model_selection import train_test_split


################################################################
# use svm to curve traffic data and predict delay for route direction
# author: Yichen
################################################################


def get_data():
    client = MongoClient('localhost', 27017);
    db = client.test;
    incidents = db.incidents;
    delaydict, cntdict = {}, {};
    feature, delay, sev_cnt = [], [], [];
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
                if (doc['roadName'], hr % 24, doc['severity']) not in delaydict:
                    delaydict[(doc['roadName'], hr % 24, doc['severity'])] = 0;
                    cntdict[(doc['roadName'], hr % 24, doc['severity'])] = 0;
                delaydict[(doc['roadName'], hr % 24, doc['severity'])] += doc['delayFromTypical'];
                cntdict[(doc['roadName'], hr % 24, doc['severity'])] += 1;
        else:
            for hr in range(st.hour, et.hour + (et.day - st.day) * 24 + 1):
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
        sev_cnt.append(cntdict[key]);
    vec = DictVectorizer();
    feature = np.array(feature);
    vec.fit(feature);
    # print vec.get_feature_names();
    joblib.dump(vec, 'vec.pkl');
    # print "vectorizer saved at: " + "vec.pkl";
    feature = vec.transform(feature).toarray();
    delay = np.array(delay, dtype=float);
    sev_cnt = np.array(sev_cnt, dtype=float);
    return feature, delay, feature, sev_cnt;


def mlp_train():
    feature, delay, severity, sev_cnt = get_data();
    X_train, X_test, y_train, y_test = train_test_split(feature, delay, test_size=0.05);
    X_train_sev, X_test_sev, y_train_sev, y_test_sev = train_test_split(severity, sev_cnt, test_size=0.05);
    mlp_delay = MLPRegressor(solver='lbfgs', activation='logistic', learning_rate='constant', learning_rate_init=0.01,
                            max_iter=1000).fit(X_train,y_train);
    mlp_sev = MLPRegressor(solver='lbfgs', activation='logistic', learning_rate='constant', learning_rate_init=0.3,
                            max_iter=1000).fit(X_train_sev, y_train_sev);
    print "test_size: " + str(0.05) + "\ttype: delay";
    print "rate: " + str(mlp_delay.score(X_test, y_test)) + "\tloss: " + str(mlp_delay.loss_);
    print "test_size: " + str(0.05) + "\ttype: severity";
    print "rate: " + str(mlp_sev.score(X_test_sev, y_test_sev)) + "\tloss: " + str(mlp_sev.loss_);
    joblib.dump(mlp_delay, 'mlp_delay.pkl');
    joblib.dump(mlp_sev, 'mlp_sev.pkl');
    # print "model saved at: " + "mlp_delay.pkl";
    return;


def mlp_predict_delay(roadname='Route 27', time=18, severity=2):
    vec = joblib.load('vec.pkl');
    mlp = joblib.load('mlp_delay.pkl');
    z = np.array([{'road': roadname, 'time': time, 'severity': severity}]);
    z = vec.transform(z);
    result = mlp.predict(z);
    print 'road: ' + roadname + '\ttime: ' + str(time) + '\tseverity: ' + str(severity);
    for i in result:
        print 'delay: ' + str(i);
    return;


def mlp_predict_sev(roadname='Route 27', time=18, severity=2):
    vec_sev = joblib.load('vec.pkl');
    mlp_sev = joblib.load('mlp_sev.pkl');
    z = np.array([{'road': roadname, 'time': time, 'severity': severity}]);
    z = vec_sev.transform(z);
    result = mlp_sev.predict(z);
    print 'road: ' + roadname + '\ttime: ' + str(time) + '\tseverity: ' + str(severity);
    for i in result:
        print '# of incidents: ' + str(i);
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
    # mlp_train();
    for i in range(0,24):
        mlp_predict_sev('Route 27', i, 2);