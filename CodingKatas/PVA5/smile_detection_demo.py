import numpy as np
import cv2 as cv
from tensorflow import keras
import tensorflow as tf

cap = cv.VideoCapture(0)
face_cascade = cv.CascadeClassifier(cv.data.haarcascades + 'haarcascade_frontalface_default.xml')
model = keras.models.load_model('smilde_detection_model')
class_names = ['negative_smiles', 'positive_smiles']

if not cap.isOpened():
    print("Cannot open camera")
    exit()
while True:
    ret, frame = cap.read()
    if not ret:
        print("Can't receive frame (stream end?). Exiting ...")
        break
    gray = cv.cvtColor(frame, cv.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray)
    for (x, y, w, h) in faces:
        cv.rectangle(gray, (x, y), (x+w, y+h), (255, 255, 0), 2)
        
        roi_image = gray[y:y+h, x:x+w]
        roi_rbg_from_gray = np.repeat(roi_image[..., np.newaxis], 3, -1)
        roi_image_resized = cv.resize(roi_rbg_from_gray, dsize=(64, 64), interpolation=cv.INTER_CUBIC)
        
        predictions = model.predict(tf.expand_dims(roi_image_resized, 0))
        predicted_label = 1 if predictions[0][0] > 0.5 else 0
        confidence = predictions[0][0] if predictions[0][0] > 0.5 else (1 - predictions[0][0])
        cv.putText(gray, f'{class_names[predicted_label]} ({round(100*confidence)}%)', (x+5,y-5), cv.FONT_HERSHEY_SIMPLEX, 1, (255,255,255), 2)
    
    cv.imshow('img', gray)
    if cv.waitKey(1) == ord('q'):
        break

cap.release()
cv.destroyAllWindows()