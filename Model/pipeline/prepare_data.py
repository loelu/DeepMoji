import tensorflow as tf
import tensorflow_datasets as tfds
import numpy as np

def prepare_data(dataset_size: int = 500):
    ds, info = tfds.load('aflw2k3d', split='train', with_info=True)
    tfds.as_dataframe(ds.take(4), info)
    assert isinstance(ds, tf.data.Dataset)

    x = []
    y = []
    for entry in ds.take(dataset_size):
        image = entry["image"]
        image = np.array(image, dtype = 'float')
        x.append(image)

        facial_landmarks = np.array(entry["landmarks_68_3d_xy_normalized"], dtype = 'float')
        facial_landmarks = facial_landmarks
        y.append(facial_landmarks)

    flat_list = []
    for i in y:
        flat_list.append([item for sublist in i for item in sublist])

    x = np.array(x)
    y = np.array(flat_list)
    
    return x,y