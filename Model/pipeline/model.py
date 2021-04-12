from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Activation, Flatten, Convolution2D, MaxPool2D, Dropout, BatchNormalization

def create_model():
    model = Sequential()


    # layer 1
    model.add(Convolution2D(32, (3,3), activation = 'relu', padding='same', use_bias=False, input_shape=(450,450,3)))
    model.add(BatchNormalization())
    model.add(MaxPool2D(pool_size=(2, 2)))

    # layer 2

    model.add(Convolution2D(32, (3,3), activation = 'relu', padding='same', use_bias=False))
    model.add(MaxPool2D(pool_size=(2, 2)))

    # layer 3

    model.add(Convolution2D(64, (3,3), activation = 'relu', padding='same', use_bias=False))
    model.add(BatchNormalization())
    model.add(MaxPool2D(pool_size=(2, 2)))

    # layer 4

    model.add(Convolution2D(128, (3,3), activation = 'relu', padding='same', use_bias=False))
    model.add(BatchNormalization())
    model.add(MaxPool2D(pool_size=(2, 2)))


    model.add(Flatten())
    model.add(Dense(256,activation='relu'))
    model.add(Dropout(0.1))
    model.add(Dense(136))
    
    model.compile(optimizer='adam', 
          loss='mean_squared_error',
          metrics=['acc'])
    return model

def fit(model, x, y):
    model.fit(x, y, batch_size=50, epochs=1, validation_split = 0.2)