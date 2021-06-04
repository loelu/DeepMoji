# DeepMoji Dokumentation
DeepMoji wurde für die Semesterarbeit im Modul DeepL entwickelt. Im Folgenden befindet sich die Dokumentation und Reflexion zu unserem Vorgehen.

## Model
Wir haben viele Iterationen beim Aufbau des Models durchgeführt, um zu einem guten Model zu kommen. Dazu haben wir zuerst damit gestartet verschiedene Datensätze anzuschauen und auszuprobieren, um einen Datensatz mit guter Qualität und genügend vielen Daten zu kommen. 

### Datensatz auswahl
Wir haben mit dem [aflw2k3d](https://www.tensorflow.org/datasets/catalog/aflw2k3d) Datensatz begonnen, welchen wir als Erstes gefunden haben. Die 2000 Bilder mit je 68 Gesichtspunkten sind jedoch mehr zur Evaluation von Facial Landmark detection models geeignet als zum Training, da sie besonders schwierige Bilder mit schwierigen Gesichtposen beinhalten. Deswegen war es schwer eine gutes Model darauf zu bauen.

Als nächstes haben wir ein [Kaggle-Datensatz](https://www.kaggle.com/c/facial-keypoints-detection/data?select=training.zip) verwendet. Dieser hatte 7049 Bilder, somit wir mehr Daten zum Training verwenden konnten. Jedoch waren nur 30 Gesichtspunkte auf den Bildern gelabelet, was für uns nicht aussreicht, um die Person zu zeichnen für den Video-Call.

Somit haben wir noch den [the300w_lp](https://www.tensorflow.org/datasets/catalog/the300w_lp) Datensatz angeschaut, welcher über 61'000 Daten mit je 68 Landmarks besizt. Der Datensatz ist nicht ganz perfekt, da er Bilder mit schwarzem Rand zeigt und viele Bilder ein wenig absichtlich verzogen sind. Jedoch bietet er viele verschiedene Kopfposen, welche dem Model beim Trainieren helfen. Der Datensatz wird auf der Website ebenfalls zum Trainieren von den Facial Landmarks empfohlen und wir haben uns entschieden mit diesem Datensatz unser Model zu bauen und darauf weiter zu iterieren und optimieren. 

Das Finden eines guten Datensatzes war für uns nicht ganz so einfach wie erwartet, und hat schon einige Zeit aufgewendet, bis wir auf den the300w_lp gestossen sind, obwohl er ebenfalls im Tensorflow Katalog zu Verfügung steht.


### Model Aufbau
Weiter haben wir verschiedene Modelle aufgebaut, trainiert und evaluiert, um das beste Model für unseren Task zu entwickeln. Hier werden wir einige Versuche und Resultate dokumentieren.

#### CNN
Zuerst haben wir ein CNN aufgebaut mit mehreren Conv2D und MaxPooling Schichten, sowie ein paar Dense Layern, um aus den Bildern zu den 136 (x- und y- Werte) Facial Landmarks zu kommen und haben diesen mit einem Adam Optimizer und dem Mean squared error trainiert. Jedoch haben wir keine normalisierte Y-Daten verwendet, sondern einfach auf dem 450 Pixel breit und langem quadratischem Bild. Das Training mit normalisierten Y-Daten hat nicht geklappt, da bei der Prediction die Landmarks alle trotz zurückscaling zu zentriert und zu nahe zueinander waren. Deshalb wurde mit den nicht normalisierten Y-Daten weitergefahren. Deshalb sind auch der Loss beim Trainieren nicht wie gewohnt sehr nahe an 0, sondern fängt sehr hoch bei Tausend an und fällt dann auf ein paar Hundert ab. Die Bild-Input Daten wurden jedoch mit einem keras Layer (Normalization) normalisiert.

Wir haben noch verschiedene Optimizer und Varianten mit dem CNN Model versucht, welche im Jupyter Notebook `experiments.ipynb` zu finden sind. Dazu haben wir mit einem Standard CNN begonnen (Convolution2D, MaxPool2D, Flatten und Dense). Nach und nach haben wir einige Optimierungen eingebaut, wie die BatchNormalization, ein Layer, welcher die Daten normalisiert, was die Trainingszeit verkürzen soll. Danach ein Dropout-Layer, welcher Overfitting verhindern soll, jedoch aber den Loss verschlechterte.

![Diagram: architecture of the CNN](./nn.svg)

Das Model-Diagramm wurde mit folgender Website erstellt: [http://alexlenail.me/NN-SVG/LeNet.html](http://alexlenail.me/NN-SVG/LeNet.html)

#### Transferlearning
Wir haben einen Versuch mit dem VGG19 und den Imagenet Gewichten als Base Model gestartet. Die Resultate des Transfer Learning Models hat die besten Loss erzielt, dauerte aber länger zum Trainieren. Der Loss nach 50 Epochen war 26, im Vergleich dazu, unsere eigenen CNN Modelle hatten einen Loss zwischen 100 und 400. Deshalb wollten das Transferlearning Model in unserer Website gebrauchen, jedoch konnte die konvertierte TensorflowJS Version nicht ins Javascript importiert werden, sondern warf eine Exception, dass ein Layer nicht verfügbar ist. Bei unseren eigenen CNN Modellen hat es dafür geklappt, deshalb haben wir es mit ihnen ausgetestet.


### Python keras Model als TensorflowJS Model in einem Frontend bereit stellen
Da unser Model in einem Jupyter Notebook mit Python entwickelt wurde, mussten wir es in eine kompatibele Form für unser VueJS-Frontend konvertieren. Dazu exportieren wir unser Python Keras Model zu einem TensorflowJS Model. Den Ordner mit dem `model.json` kopierten wir dann zum `public` Ordner im Frontend, sodass das Frontend auf die Daten zur Laufzeit zugreifen kann. Während der Videoübertragung wird das Model verwendet, um eine Prediction zu dem Facial landmarks zu machen und die 68 Punkte auf dem Canvas darzustellen und zu senden statt dem ganzen Video.

https://www.tensorflow.org/js/tutorials/conversion/import_keras

## Frontend

### Peer-to-peer connection

### Canvas


