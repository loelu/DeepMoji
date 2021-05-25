from tensorflow import keras
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Activation, Flatten, Convolution2D, MaxPool2D, Dropout, BatchNormalization, Conv2D, Input
from tensorflow.keras.models import Sequential, Model
from tensorflow.keras.layers import Activation, Convolution2D, MaxPooling2D, BatchNormalization, Flatten, Dense, Dropout, Conv2D,MaxPool2D, ZeroPadding2D


def create_model(input_shape: (int, int, int), output_length: int) -> Sequential:
    inputs = Input(shape=input_shape, name="image_input")
    x = keras.layers.experimental.preprocessing.Normalization()(inputs)
    
    x = Convolution2D(32, (3,3), activation = 'relu', padding='same', use_bias=False)(x)
    x = BatchNormalization()(x)
    x = MaxPool2D(pool_size=(2, 2))(x)

    x = Convolution2D(32, (3,3), activation = 'relu', padding='same', use_bias=False)(x)
    x = MaxPool2D(pool_size=(2, 2))(x)

    x = Convolution2D(64, (3,3), activation = 'relu', padding='same', use_bias=False)(x)
    x = BatchNormalization()(x)
    x = MaxPool2D(pool_size=(2, 2))(x)

    x = Convolution2D(128, (3,3), activation = 'relu', padding='same', use_bias=False)(x)
    x = BatchNormalization()(x)
    x = MaxPool2D(pool_size=(2, 2))(x)
    
    x = Convolution2D(128, (3,3), activation = 'relu', padding='same', use_bias=False)(x)
    x = BatchNormalization()(x)
    x = MaxPool2D(pool_size=(2, 2))(x)
    
    x = Convolution2D(256, (3,3), activation = 'relu', padding='same', use_bias=False)(x)
    x = BatchNormalization()(x)
    x = MaxPool2D(pool_size=(2, 2))(x)

    x = Flatten()(x)
    x = Dense(256, activation='relu')(x)
    x = Dropout(0.5)(x)
    outputs = Dense(output_length)(x)
    
    model = Model(inputs=inputs, outputs=outputs, name="deepmoji")
    model.compile(optimizer='adam', 
          loss='mean_squared_error')
    return model