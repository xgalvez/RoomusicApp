import { ListItem, ListSeparator } from '../components/Llista';
import { styles, url } from './Login';

import Toast from 'react-native-root-toast';
import React, { useEffect, useState } from 'react';
import { StyleSheet,FlatList, View, Alert } from 'react-native';

export const AlbumSongs = ({route}) => {
    const [data, setData] = useState(null);
  
    const { albumName, albumArtist, albumYear, sessionToken } = route.params;
    console.log("Album: " + albumName+", Artist: "+albumArtist+", Year: "+albumYear);
  
    useEffect(() => {
      const fetchData = async () => {
        const response = await fetch(url+':3000/api/api/v1/db/album-songs', {
          method: 'POST',
          headers: {
            Accept: '*/*',
            'Content-Type': 'application/json; charset=utf-8',
            'x-access-token': sessionToken,
  /*          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imd1ZXN0IiwiaWF0IjoxNjUxMDcxMTUwfQ.OyEwf_Jdyd0rCPDsCat6U_47fzGJC7-crRA57fzfcjs',*/
          },
          body: JSON.stringify({
            album: albumName,
            artist: albumArtist, 
            year: albumYear
          })
        });
        const newData = await response.json();
    //    console.log(JSON.stringify(newData));
  
        const newData2 = newData.map(( item,ix) => {
          return {
            id: ix,
            filepath: item.filepath,
            metadata: item.metadata
          };
        })
    //    console.log(newData2);
        setData(newData2);
      };
      fetchData();
    });

    function doFetch(filepath){
      console.log("fer fetch");
      fetch(url+':3000/api/v1/playlist/add-song', {
        method: 'POST',
        headers: {
        Accept: '*/*',
        'Content-Type': 'application/json; charset=utf-8',
        'x-access-token': sessionToken,
        /*'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imd1ZXN0IiwiaWF0IjoxNjUxMDcxMTUwfQ.OyEwf_Jdyd0rCPDsCat6U_47fzGJC7-crRA57fzfcjs',*/
      },
      body: JSON.stringify({playlist: "queue", song: filepath} )
    })
    let toast = Toast.show('Has afegit la cançó a la cua!', {
      duration: Toast.durations.LONG,
    });
    }
  
    return (
      <FlatList
        style={styles.container}
        data={data}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ListItem
            title={item.metadata.title}
            subtitle={item.metadata.year}
            onPress= {()=> Alert.alert(
              "Alert Title",
              "My Alert Msg",
              [
                {
                  text: "SÍ",
                  onPress: () => doFetch(item.filepath),
                },
                { text: "NO", 
                  onPress: () => console.log("No s'afegeix"),
                  style: "cancel" }
              ]
            )}
          />
        )}
        ItemSeparatorComponent={ListSeparator}
        ListHeaderComponent={ListSeparator}
        ListFooterComponent={ListSeparator}
      />
    );
  };