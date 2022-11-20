
import numpy as np
from keras.utils import load_img, img_to_array


flower_classes = ['Daisy','Dandelion','Rose','Sunflower','Tulip']
fruit_classes = ['Apple','Avocado','Banana','Cherry','Dragonfruit','Kiwi','Lemon','Lychee','Mango','Mulberry','Orange','Peach','Pineapple','Salak','Starfruit','Strawberry']

def _predict(image_url,model,classes):
    test_image = load_img(image_url,target_size=(100,100))
    test_image = img_to_array(test_image)
    test_image = np.expand_dims(test_image, axis = 0)
    test_image = test_image / 255
    pred = model.predict(test_image)
    argmax = np.argmax(pred)
    if(argmax > len(classes)):
        return "not found"
    label = classes[argmax]
    return label

    # accuracy = np.max(pred)*100
    # print(pred)
    # if (accuracy < 50):
    #     print("this fruit not found")
    # print("label:",classes[np.argmax(pred)])
    # print(accuracy,"%")
