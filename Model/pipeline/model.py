from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Activation, Flatten, Convolution2D, MaxPool2D, Dropout, BatchNormalization, Conv2D
from tensorflow.keras.models import Sequential, Model
from tensorflow.keras.layers import Activation, Convolution2D, MaxPooling2D, BatchNormalization, Flatten, Dense, Dropout, Conv2D,MaxPool2D, ZeroPadding2D


def create_model(input_shape: (int, int, int), output_length: int) -> Sequential:
    model = Sequential()

    model.add(Convolution2D(32, (3,3), activation = 'relu', padding='same', use_bias=False, input_shape=input_shape))
    model.add(BatchNormalization())
    model.add(MaxPool2D(pool_size=(2, 2)))

    model.add(Convolution2D(32, (3,3), activation = 'relu', padding='same', use_bias=False))
    model.add(MaxPool2D(pool_size=(2, 2)))

    model.add(Convolution2D(64, (3,3), activation = 'relu', padding='same', use_bias=False))
    model.add(BatchNormalization())
    model.add(MaxPool2D(pool_size=(2, 2)))

    model.add(Convolution2D(128, (3,3), activation = 'relu', padding='same', use_bias=False))
    model.add(BatchNormalization())
    model.add(MaxPool2D(pool_size=(2, 2)))
    
    model.add(Convolution2D(128, (3,3), activation = 'relu', padding='same', use_bias=False))
    model.add(BatchNormalization())
    model.add(MaxPool2D(pool_size=(2, 2)))
    
    model.add(Convolution2D(256, (3,3), activation = 'relu', padding='same', use_bias=False))
    model.add(BatchNormalization())

    model.add(Flatten())
    model.add(Dense(256,activation='relu'))
    model.add(Dropout(0.1))
    model.add(Dense(output_length))
    
    model.compile(optimizer='adam', 
          loss='mean_squared_error',
          metrics=['acc'])
    return model
